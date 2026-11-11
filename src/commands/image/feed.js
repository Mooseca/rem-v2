let RRACommand = require('../../structures/rraCommand');
class FeedImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'feed';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Feed someone', usage: '{{prefix}}feed [@user]'};
    }
}
module.exports = FeedImage;
