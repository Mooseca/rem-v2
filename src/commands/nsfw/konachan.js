/**
 * Created by Julian/Wolke on 07.11.2016.
 */
let Command = require('../../structures/command');
let winston = require('winston');
const booru = require('../../structures/booru');

// Terms to block from search (not added as hidden tags on the search because
// kona limits searches to 6 tags, so we remove tags from the query before we
// send it and filter out bad items from the response)
const konachanFilter = [
    'loli', // loli, lolicon
    'shota', // shota, shotacon
    'child' // child, child_porn
];

class Konachan extends Command {
    constructor({t}) {
        super();
        this.cmd = 'kona';
        this.cat = 'nsfw';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
    }

    async run(msg) {
        // Force commands to only run in NSFW channels
        if (!msg.channel.nsfw) {
            return msg.channel.createMessage(this.t('nsfw-images.error-discord-not-nsfw-channel', {lngs: msg.lang}));
        }

        let msgSplit = msg.content.split(' ');
        let msgSearch = '';
        let searchOrig = '';
        for (let i = 1; i < msgSplit.length; i++) {
            if (i === 1) {
                searchOrig = msgSplit[i];
            } else {
                searchOrig = searchOrig + ' ' + msgSplit[i];
            }
        }

        // Filter query
        for (let filter of konachanFilter) {
            if (searchOrig.indexOf(filter) > -1) {
                return msg.channel.createMessage(this.t('nsfw-images.error-discord-tos-conflict', {lngs: msg.lang}));
            }
        }

        msgSearch = 'order:score -rating:safe ' + searchOrig;
        try {
            let url = await booru.randomPost({
                url: 'https://konachan.com/post.json',
                tags: msgSearch,
                filter: konachanFilter
            });
            if (url) {
                return msg.channel.createMessage(url);
            }
            return msg.channel.createMessage(this.t('nsfw-images.nothing-found', {
                lngs: msg.lang,
                tags: searchOrig
            }));
        } catch (e) {
            winston.error(e.message);
            return msg.channel.createMessage(this.t('nsfw-images.error-body', {lngs: msg.lang}));
        }
    }
}
module.exports = Konachan;
