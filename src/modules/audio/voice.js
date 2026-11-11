/**
 * Voice support for Eris through @discordjs/voice.
 * Eris' own voice code predates Discord's current voice encryption (DAVE),
 * so it can no longer connect. This keeps the same small API the rest of Rem
 * uses (rem.joinVoiceChannel, rem.voiceConnections.get/leave, connection.play...)
 * and hands the actual connection to @discordjs/voice.
 */
const EventEmitter = require('eventemitter3');
const child_process = require('child_process');
const winston = require('winston');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    getVoiceConnection,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    StreamType,
    NoSubscriberBehavior
} = require('@discordjs/voice');

const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
const YTDLP = process.env.YTDLP_PATH || 'yt-dlp';

/**
 * Starts yt-dlp writing the best audio of a page to stdout
 * @param {String} url
 * @returns {ChildProcess}
 */
function ytdlpProcess(url) {
    const args = ['-f', 'bestaudio/best', '--no-playlist', '--quiet', '--no-warnings', '-o', '-', url];
    return child_process.spawn(YTDLP, args, {stdio: ['ignore', 'pipe', 'pipe']});
}

/**
 * A voice connection with the methods Rem expects from Eris
 */
class RemVoiceConnection extends EventEmitter {
    constructor(manager, guildID, channelID, connection) {
        super();
        this.manager = manager;
        this.id = guildID;
        this.channelID = channelID;
        this.connection = connection;
        this.processes = [];
        this.resource = null;
        this.ignoreIdle = false;
        this.volume = 1;
        this.player = createAudioPlayer({behaviors: {noSubscriber: NoSubscriberBehavior.Play}});
        this.player.on('stateChange', (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                this.killProcesses();
                this.resource = null;
                if (this.ignoreIdle) {
                    this.ignoreIdle = false;
                    return;
                }
                this.emit('end');
            }
        });
        this.player.on('error', (err) => {
            winston.error(`Audio player error: ${err.message}`);
            this.ignoreIdle = true;
            this.emit('error', err);
        });
        connection.subscribe(this.player);
    }

    get ready() {
        return this.connection.state.status === VoiceConnectionStatus.Ready;
    }

    get playing() {
        return this.player.state.status === AudioPlayerStatus.Playing;
    }

    get paused() {
        return this.player.state.status === AudioPlayerStatus.Paused;
    }

    get current() {
        if (!this.resource) {
            return null;
        }
        return {playTime: this.resource.playbackDuration};
    }

    /**
     * Plays a source
     * @param {String|Stream} input - an url or file path for ffmpeg, a readable stream,
     * or {ytdlp: url} to let yt-dlp fetch the audio
     * @param {Object} [options]
     * @param {Array} [options.inputArgs] - extra ffmpeg arguments placed before the input
     */
    play(input, options = {}) {
        if (this.resource) {
            this.ignoreIdle = true;
            this.player.stop(true);
            this.killProcesses();
        }
        let ffmpegInput = input;
        let stdin = 'ignore';
        let source = null;
        if (input && input.ytdlp) {
            source = ytdlpProcess(input.ytdlp);
            source.stderr.on('data', (d) => winston.warn(`yt-dlp: ${d.toString().trim()}`));
            source.on('error', (err) => this.emit('error', err));
            this.processes.push(source);
            ffmpegInput = '-';
            stdin = 'pipe';
        } else if (input && typeof input.pipe === 'function') {
            ffmpegInput = '-';
            stdin = 'pipe';
        }
        const args = [
            '-hide_banner', '-loglevel', 'error',
            ...(stdin === 'pipe' ? [] : (options.inputArgs || [])),
            '-i', ffmpegInput,
            '-vn', '-f', 's16le', '-ar', '48000', '-ac', '2', 'pipe:1'
        ];
        const ffmpeg = child_process.spawn(FFMPEG, args, {stdio: [stdin, 'pipe', 'pipe']});
        this.processes.push(ffmpeg);
        ffmpeg.on('error', (err) => this.emit('error', err));
        ffmpeg.stderr.on('data', (d) => winston.warn(`ffmpeg: ${d.toString().trim()}`));
        if (stdin === 'pipe') {
            const stream = source ? source.stdout : input;
            ffmpeg.stdin.on('error', () => {
            });
            stream.on('error', () => {
            });
            stream.pipe(ffmpeg.stdin);
        }
        this.resource = createAudioResource(ffmpeg.stdout, {inputType: StreamType.Raw, inlineVolume: true});
        this.resource.volume.setVolume(this.volume);
        this.player.play(this.resource);
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.resource && this.resource.volume) {
            this.resource.volume.setVolume(volume);
        }
    }

    stopPlaying() {
        if (this.resource) {
            this.player.stop(true);
        }
        this.killProcesses();
    }

    pause() {
        this.player.pause();
    }

    resume() {
        this.player.unpause();
    }

    switchChannel(channelID) {
        this.channelID = channelID;
    }

    killProcesses() {
        for (let proc of this.processes) {
            try {
                proc.kill('SIGKILL');
            } catch (e) {
            }
        }
        this.processes = [];
    }

    disconnect() {
        this.ignoreIdle = true;
        this.stopPlaying();
        this.player.stop(true);
        try {
            this.connection.destroy();
        } catch (e) {
        }
        this.emit('disconnect');
    }
}

/**
 * Replaces Eris' VoiceConnectionManager
 */
class RemVoiceManager extends Map {
    constructor(bot) {
        super();
        this.bot = bot;
        this.adapters = new Map();
        bot.on('rawWS', (packet) => this.onPacket(packet));
        bot.joinVoiceChannel = (channelID) => this.joinChannel(channelID);
        bot.leaveVoiceChannel = (channelID) => this.leave(this.bot.channelGuildMap[channelID]);
    }

    onPacket(packet) {
        if (!packet || !packet.d) {
            return;
        }
        if (packet.t === 'VOICE_SERVER_UPDATE') {
            const adapter = this.adapters.get(packet.d.guild_id);
            if (adapter) {
                adapter.onVoiceServerUpdate({
                    token: packet.d.token,
                    guild_id: packet.d.guild_id,
                    endpoint: packet.d.endpoint
                });
            }
        } else if (packet.t === 'VOICE_STATE_UPDATE') {
            if (packet.d.guild_id && this.bot.user && packet.d.user_id === this.bot.user.id) {
                const adapter = this.adapters.get(packet.d.guild_id);
                if (adapter) {
                    adapter.onVoiceStateUpdate(Object.assign({}, packet.d));
                }
            }
        }
    }

    adapterCreator(guildID) {
        return (methods) => {
            this.adapters.set(guildID, methods);
            return {
                sendPayload: (payload) => {
                    const shard = this.bot.shards.get(this.bot.guildShardMap[guildID] || 0);
                    if (!shard || shard.status !== 'ready') {
                        return false;
                    }
                    shard.sendWS(payload.op, payload.d);
                    return true;
                },
                destroy: () => {
                    this.adapters.delete(guildID);
                }
            };
        };
    }

    async joinChannel(channelID) {
        const guildID = this.bot.channelGuildMap[channelID];
        if (!guildID) {
            throw new Error('Channel not found');
        }
        const existing = this.get(guildID);
        if (existing && existing.channelID === channelID) {
            return existing;
        }
        const connection = joinVoiceChannel({
            channelId: channelID,
            guildId: guildID,
            selfDeaf: true,
            adapterCreator: this.adapterCreator(guildID)
        });
        if (existing) {
            existing.connection = connection;
            existing.switchChannel(channelID);
            connection.subscribe(existing.player);
        }
        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 20000);
        } catch (e) {
            connection.destroy();
            this.delete(guildID);
            throw e;
        }
        if (existing) {
            return existing;
        }
        const conn = new RemVoiceConnection(this, guildID, channelID, connection);
        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            try {
                // Moved to another channel or a brief network drop, wait for it to reconnect
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5000)
                ]);
            } catch (e) {
                this.leave(guildID);
            }
        });
        this.set(guildID, conn);
        return conn;
    }

    join(guildID, channelID) {
        return this.joinChannel(channelID);
    }

    leave(guildID) {
        const conn = this.get(guildID);
        this.delete(guildID);
        if (conn) {
            conn.disconnect();
        } else {
            const connection = getVoiceConnection(guildID);
            if (connection) {
                connection.destroy();
            }
        }
    }

    voiceServerUpdate() {
        // handled through rawWS
    }

    filter(fn) {
        return Array.from(this.values()).filter(fn);
    }
}

module.exports = {RemVoiceManager, RemVoiceConnection};
