let RRACommand = require('../../structures/rraCommand');
class PunchImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'punch';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Punch someone', usage: '{{prefix}}punch [@user]'};
    }
}
module.exports = PunchImage;
