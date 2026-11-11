let RRACommand = require('../../structures/rraCommand');
class YeetImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'yeet';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Yeet someone', usage: '{{prefix}}yeet [@user]'};
    }
}
module.exports = YeetImage;
