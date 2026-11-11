/**
 * Created by Julian/Wolke on 06.01.2017.
 */
let Song = require('./song.js');
let websocket = require('ws');
class Radio extends Song {
    constructor (options) {
        super(options);
        this.options = options;
        this.ws = null;
        this.ended = false;
    }

    updateTitle (title) {
        this.title = title;
    }

    connect () {
        this.ended = false;
        this.ws = new websocket(this.options.wsUrl);
        this.ws.on('open', () => {
            this.connectionAttempts = 1;
        });
        this.ws.on('message', (msg, flags) => {
            this.onMessage(msg, flags)
        });
        this.ws.on('error', (err) => this.onError(err));
        this.ws.on('close', (code, number) => this.onDisconnect(code, number));
    }


    onError (err) {
        console.error(err);
        console.log(`ws error!`);
        // this.reconnect();
    }

    end () {
        this.ended = true;
        clearInterval(this.heartbeat);
        try {
            this.ws.close(4000, 'not needed anymore');
        } catch (e) {

        }
        this.ws = null;
    }

    onDisconnect (code, number) {
        console.error(code);
        console.error(number);
        clearInterval(this.heartbeat);
        if (!this.ended) {
            setTimeout(() => {
                if (!this.ended) this.connect();
            }, 5000);
        }
    }

    onMessage (msg, flags) {
        try {
            let actualMessage = JSON.parse(msg);
            // listen.moe gateway v2: op 0 says how often to heartbeat, op 1 carries the song
            if (actualMessage.op === 0 && actualMessage.d && actualMessage.d.heartbeat) {
                clearInterval(this.heartbeat);
                this.heartbeat = setInterval(() => {
                    if (this.ws && this.ws.readyState === websocket.OPEN) {
                        this.ws.send(JSON.stringify({op: 9}));
                    }
                }, actualMessage.d.heartbeat);
            }
            if (actualMessage.op === 1 && actualMessage.d && actualMessage.d.song) {
                let song = actualMessage.d.song;
                let artists = (song.artists || []).map((a) => a.nameRomaji || a.name).join(', ');
                this.updateTitle(`${artists ? artists + ' - ' : ''}${song.title} (${this.options.radio})`);
            }
            if (actualMessage.song_name && actualMessage.artist_name) {
                this.updateTitle(`${actualMessage.artist_name} - ${actualMessage.song_name} (${this.options.radio})`);
            }
        } catch (e) {
            if (msg !== '') {
                console.error(e);
            }
        }
    }
}
module.exports = Radio;