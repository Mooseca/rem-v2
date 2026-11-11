/**
 * Created by Julian/Wolke on 07.11.2016.
 */
let Command = require('../../structures/command');
let winston = require('winston');
let axios = require('axios');
class Dog extends Command {
    constructor({t}) {
        super();
        this.cmd = 'dog';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
    }

    async run(msg) {
        try {
            // skip videos, Discord won't show them in an embed
            let url;
            for (let i = 0; i < 5 && !url; i++) {
                let req = await axios.get('https://random.dog/woof.json', {timeout: 10000});
                if (!/\.(mp4|webm)$/i.test(req.data.url)) url = req.data.url;
            }
            msg.channel.createMessage({embed: {image: {url}, color: 0x00ADFF}});
        } catch (e) {
            winston.error(e.message);
            msg.channel.createMessage(this.t('generic.error', {lngs: msg.lang}));
        }
    }
}
module.exports = Dog;