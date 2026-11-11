let RRACommand = require('../../structures/rraCommand');
class HandholdImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'handhold';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Hold hands with someone', usage: '{{prefix}}handhold [@user]'};
    }
}
module.exports = HandholdImage;
