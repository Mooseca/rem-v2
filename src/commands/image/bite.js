let RRACommand = require('../../structures/rraCommand');
class BiteImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'bite';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Bite someone', usage: '{{prefix}}bite [@user]'};
    }
}
module.exports = BiteImage;
