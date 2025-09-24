const chalk = require('chalk');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(chalk.green.bold(`🎵 Bot is ready! Logged in as ${client.user.tag}`));
        console.log(chalk.cyan(`📊 Serving ${client.guilds.cache.size} servers with ${client.users.cache.size} users`));
        
        // Clean up expired premium users
        client.db.cleanupExpiredPremium();
        console.log(chalk.yellow('🧹 Cleaned up expired premium users'));
    }
};