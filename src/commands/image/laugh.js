let RRACommand = require('../../structures/rraCommand');
class LaughImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'laugh';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Laugh', usage: '{{prefix}}laugh [@user]'};
    }
}
module.exports = LaughImage;
