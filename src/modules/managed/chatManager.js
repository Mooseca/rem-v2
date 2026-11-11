/**
 * Replies when someone mentions Rem. Replaces the old cleverbot.io manager (that service is gone)
 * with any OpenAI-compatible chat API, e.g. Ollama (http://host:11434/v1) or OpenAI itself.
 * Set chat_api_url and chat_model in the config (chat_api_key if the API needs one).
 */
let Manager = require('../../structures/manager');
let axios = require('axios');
let winston = require('winston');
const mentionRegex = /<@!?[0-9]+>/g;
const historyLength = 10;

class ChatManager extends Manager {
    constructor() {
        super();
        this.histories = {};
        this.apiUrl = remConfig.chat_api_url ? remConfig.chat_api_url.replace(/\/$/, '') : null;
        this.model = remConfig.chat_model;
        this.apiKey = remConfig.chat_api_key;
        this.systemPrompt = remConfig.chat_system_prompt || 'You are Rem, a friendly maid from Re:Zero who lives in a Discord server. Keep replies short and casual.';
    }

    async talk(msg) {
        if (!this.apiUrl || !this.model) {
            return msg.channel.createMessage('Chat is not set up on this bot.');
        }
        let text = msg.content.replace(mentionRegex, '').trim();
        if (!text) {
            return;
        }
        let history = this.histories[msg.channel.id] || [];
        history.push({role: 'user', content: `${msg.author.username}: ${text}`});
        try {
            msg.channel.sendTyping().catch(() => {
            });
            let headers = this.apiKey ? {Authorization: `Bearer ${this.apiKey}`} : {};
            let res = await axios.post(`${this.apiUrl}/chat/completions`, {
                model: this.model,
                messages: [{role: 'system', content: this.systemPrompt}].concat(history),
                max_tokens: 400
            }, {headers, timeout: 120000});
            let reply = res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
            history.push({role: 'assistant', content: reply});
            this.histories[msg.channel.id] = history.slice(-historyLength);
            return msg.channel.createMessage(reply.substring(0, 2000) || '...');
        } catch (e) {
            winston.error(`Chat error: ${e.message}`);
            return msg.channel.createMessage(':x: I could not think of a reply, try again later.');
        }
    }
}
module.exports = {class: ChatManager, deps: [], async: false, shortcode: 'cm'};
