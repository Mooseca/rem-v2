/**
 * Created by Julian/Wolke on 07.11.2016.
 */
let Command = require('../../structures/command');
let winston = require('winston');
const booru = require('../../structures/booru');

// Terms to block from search (not added as hidden tags on the search because
// e621 limits searches to 6 tags, so we remove tags from the query before we
// send it and filter out bad items from the response)
const e621Filter = [
    'loli', // loli
    'shota', // shota
    'child', // child
    'young' // young
];

class E621 extends Command {
    constructor({t}) {
        super();
        this.cmd = 'e621';
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
        for (let filter of e621Filter) {
            if (searchOrig.indexOf(filter) > -1) {
                return msg.channel.createMessage(this.t('nsfw-images.error-discord-tos-conflict', {lngs: msg.lang}));
            }
        }

        msgSearch = 'order:score -rating:s ' + searchOrig;
        try {
            let url = await booru.randomPost({
                url: 'https://e621.net/posts.json',
                tags: msgSearch,
                filter: e621Filter,
                posts: d => d.posts,
                postTags: p => Object.values(p.tags).reduce((a, b) => a.concat(b), []).join(' '),
                fileUrl: p => p.file.url
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
module.exports = E621;
