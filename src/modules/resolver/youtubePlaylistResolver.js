/**
 * Created by Julian on 22.03.2017.
 */
let regex = /(?:http(?:s|):\/\/)?(?:www\.|m\.|music\.|)?(?:youtube\.com|youtu\.be)\/(?:playlist|watch\?v=[a-zA-Z\-_0-9]+|[a-zA-Z\-_0-9]+)?(?:&.+|)(?:(?:[&?])list=([a-zA-Z\-_0-9]+)?)(?:&.+|)/;
let Song = require('../../structures/song');
let SongTypes = require('../../structures/constants').SONG_TYPES;
let ytr = require('./youtubeResolver');
let ytdlp = require('../audio/ytdlp');
class YoutubePlaylistResolver {
    constructor() {

    }

    canResolve(url) {
        return regex.test(url);
    }

    async resolve(url) {
        let id = this.getIdFromLink(url);
        if (!id) {
            throw new Error('failed to fetch id from url provided.');
        }
        let info = await ytdlp.getInfo(`https://www.youtube.com/playlist?list=${id}`, ['--flat-playlist']);
        let entries = (info.entries || []).filter((e) => e && e.id);
        if (entries.length === 0) {
            throw new Error(`This id (${id}) seems bad.`);
        }
        let playlist = {title: info.title, author: info.uploader || info.channel, songs: []};
        let songs = entries.map((video) => new Song({
            id: video.id,
            type: SongTypes.youtube,
            duration: ytr.convertDuration({length_seconds: video.duration || 0}),
            url: `https://www.youtube.com/watch?v=${video.id}`,
            needsResolve: true,
            title: video.title,
            local: false
        }));
        songs[0] = await ytr.resolve(songs[0].url);
        playlist.songs = songs;
        return Promise.resolve(playlist);
    }

    getIdFromLink(url) {
        let m;
        m = regex.exec(url);
        for (let i = 0; i < m.length; i++) {
            if (typeof m[i] !== 'undefined' && m[i] !== url) {
                return m[i];
            }
        }
    }
}
module.exports = new YoutubePlaylistResolver();
