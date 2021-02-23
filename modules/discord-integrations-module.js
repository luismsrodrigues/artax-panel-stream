const DISCORD_WEBHOOK = require("webhook-discord")
const HOOK = new DISCORD_WEBHOOK.Webhook("https://discord.com/api/webhooks/813503860953710694/g0NuCgsO6fROkj6uqV9gurzrz-iUx24zV2-SA7HtqK1e9WAG6lzwZj9TccCJWBDdTRyj")
const DISCORD_HOOK_NAME = "Captain Logs";

module.exports = function () {
    return {
        Error: (object) => HOOK.err(DISCORD_HOOK_NAME, JSON.stringify(object)),
        Info: (object) => HOOK.info(DISCORD_HOOK_NAME, JSON.stringify(object)),
        Success: (object) => HOOK.success(DISCORD_HOOK_NAME, JSON.stringify(object)),
    }
}