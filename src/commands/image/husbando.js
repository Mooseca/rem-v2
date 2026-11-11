let RRACommand = require('../../structures/rraCommand');
class HusbandoImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'husbando';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'A random husbando picture', usage: '{{prefix}}husbando [@user]'};
    }
}
module.exports = HusbandoImage;
