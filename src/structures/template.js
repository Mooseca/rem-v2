//The config template, makes sure rem has all the needed config options
module.exports = {
    owner: {
        required: false
    },
    owner_id: {
        required: true
    },
    token: {
        required: true
    },
    client_id: {
        required: true
    },
    bot_id: {
        required: true
    },
    // beta: {
    //     required: false
    // },
    osu_token: {
        required: false
    },
    // osu_path: {
    //     required: false
    // },
    osu_username: {
        required: false
    },
    osu_password: {
        required: false
    },
    environment: {
        required: false
    },
    // discord_bots_token: {
    //     required: true
    // },
    // carbon_token: { Not needed anymore, as the stats are handled by the master.
    //     required: true
    // },
    sentry_token: {
        required: false
    },
    anilist_secret: {
        required: false
    },
    lbsearch_sfw_key: {
        required: false
    },
    lbsearch_nsfw_key: {
        required: false
    },
    mashape_key: {
        required: false
    },
    shard_token: {
        required: false
    },
    soundcloud_key: {
        required: false
    },
    mongo_hostname: {
        required: true
    },
    master_hostname: {
        required: false
    },
    redis_enabled: {
        required: false
    },
    redis_hostname: {
        required: false
    },
    redis_database: {
        required: false
    }
};