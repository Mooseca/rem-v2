/**
 * Created by Julian/Wolke on 08.11.2016.
 */
/**
 * The youtube importer
 * @extends BasicImporter
 *
 */
let regex = /(?:http?s?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|shorts\/|live\/)?([a-zA-Z0-9_-]+)(?:[&?].*|)/;
let BasicImporter = require('../../structures/basicImporter');
const types = require('../../structures/constants').SONG_TYPES;
let Song = require('../../structures/song');
let ytdlp = require('../audio/ytdlp');
class YoutubeImporter extends BasicImporter {
    constructor() {
        super();
    }

    canResolve(url) {
        return regex.test(url);
    }

    async resolve(url) {
        let info = await ytdlp.getInfo(url, ['--no-playlist']);
        let live = !!info.is_live;
        return new Song({
            id: info.id,
            title: info.title,
            duration: live ? 'live' : this.convertDuration({length_seconds: info.duration || 0}),
            type: live ? types.youtube_live : types.youtube,
            url: `https://www.youtube.com/watch?v=${info.id}`,
            isResolved: true,
            local: false,
            live: live,
            isOpus: false
        });
    }
}
module.exports = new YoutubeImporter();
