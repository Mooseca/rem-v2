let RRACommand = require('../../structures/rraCommand');
class ThumbsupImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'thumbsup';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Thumbs up', usage: '{{prefix}}thumbsup [@user]'};
    }
}
module.exports = ThumbsupImage;
