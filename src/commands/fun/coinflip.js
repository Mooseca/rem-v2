/**
 * Created by EpicPick on 13.11.2016.
 */
let Command = require('../../structures/command');
class FlipCoin extends Command {
    constructor({t}) {
        super();
        this.cmd = 'coin';
        this.cat = 'fun';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.aliases = ['coinflip'];
    }

    run(msg) {
        let reply = Math.random() < 0.5 ? 'flip.head' : 'flip.tail';
        msg.channel.createMessage(this.t(reply, {lngs: msg.lang, url: '🪙'}));
    }
}
module.exports = FlipCoin;