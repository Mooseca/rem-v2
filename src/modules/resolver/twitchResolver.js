/**
 * Created by julia on 28.02.2017.
 */
let Song = require('../../structures/song');
let BasicImporter = require('../../structures/basicImporter');
let ytdlp = require('../audio/ytdlp');
let SongTypes = require('../../structures/constants').SONG_TYPES;
let regex = /(?:http(?:s|):\/\/|)(?:www\.|)twitch\.tv\/.+/;
class TwitchResolver extends BasicImporter {
    constructor() {
        super();
    }

    canResolve(url) {
        return regex.test(url);
    }

    async resolve(url) {
        let info;
        try {
            info = await ytdlp.getInfo(url);
        } catch (e) {
            throw new Error('Channel is not Live!');
        }
        if (!info.is_live) {
            throw new Error('Channel is not Live!');
        }
        return new Song({
            id: info.id,
            type: SongTypes.twitch,
            title: info.uploader || info.uploader_id || info.title,
            url: info.webpage_url || url,
            duration: "live",
            needsResolve: false,
            live: true
        });
    }
}
module.exports = new TwitchResolver();
