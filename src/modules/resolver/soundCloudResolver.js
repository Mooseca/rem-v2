/**
 * Created by Julian/Wolke on 08.11.2016.
 */
let BasicImporter = require('../../structures/basicImporter');
const types = require('../../structures/constants').SONG_TYPES;
const Song = require('../../structures/song');
let ytdlp = require('../audio/ytdlp');
let regex = /(?:http?s?:\/\/)?(?:www\.|m\.)?(?:soundcloud\.com|snd\.sc|on\.soundcloud\.com)\/(?:.*)/;
class SoundcloudImporter extends BasicImporter {
    constructor() {
        super();
    }

    canResolve(url) {
        return regex.test(url);
    }

    async resolve(url) {
        let info = await ytdlp.getInfo(url, ['--no-playlist']);
        return new Song({
            id: info.id,
            type: types.soundcloud,
            title: info.title,
            needsResolve: false,
            url: info.webpage_url || url,
            duration: this.convertDuration({length_seconds: info.duration || 0})
        });
    }
}
module.exports = new SoundcloudImporter();
