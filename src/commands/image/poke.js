let RRACommand = require('../../structures/rraCommand');
class PokeImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'poke';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Poke someone', usage: '{{prefix}}poke [@user]'};
    }
}
module.exports = PokeImage;
