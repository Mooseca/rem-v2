let RRACommand = require('../../structures/rraCommand');
class KitsuneImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'kitsune';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'A random kitsune picture', usage: '{{prefix}}kitsune [@user]'};
    }
}
module.exports = KitsuneImage;
