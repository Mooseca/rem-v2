let RRACommand = require('../../structures/rraCommand');
class HappyImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'happy';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Be happy', usage: '{{prefix}}happy [@user]'};
    }
}
module.exports = HappyImage;
