const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'setup',
    description: 'Set up the bot for your server',
    
    slashCommand: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Set up the bot for your server')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Permission')
                .setDescription('You need Administrator permission to run setup!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const settings = client.db.getGuildSettings(message.guild.id);
        
        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('⚙️ Bot Setup Complete!')
            .setDescription('The bot has been set up successfully for your server!')
            .addFields(
                { name: '📝 Current Settings', value: `**Prefix:** ${settings.prefix}\n**Default Volume:** ${settings.default_volume}%\n**Auto Disconnect:** ${settings.auto_disconnect ? 'Enabled' : 'Disabled'}\n**24/7 Mode:** ${settings.stay_in_vc ? 'Enabled' : 'Disabled'}`, inline: false },
                { name: '🎵 Music Features', value: '• High-quality audio streaming\n• YouTube support\n• Queue management\n• 16 audio filters', inline: true },
                { name: '💎 Premium Features', value: '• Unlimited usage\n• Priority support\n• Advanced filters\n• Custom settings', inline: true },
                { name: '🔧 Quick Commands', value: '• `help` - View all commands\n• `play <song>` - Start playing music\n• `set-prefix <prefix>` - Change prefix\n• `premium` - Manage premium', inline: false }
            )
            .addFields(
                { name: '🚀 Getting Started', value: '1. Join a voice channel\n2. Use `play <song name>` to start\n3. Use `help` for more commands\n4. Enjoy your music!', inline: false }
            )
            .setFooter({ text: 'Thanks for choosing our music bot!' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Permission')
                .setDescription('You need Administrator permission to run setup!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const settings = client.db.getGuildSettings(interaction.guild.id);
        
        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('⚙️ Bot Setup Complete!')
            .setDescription('The bot has been set up successfully for your server!')
            .addFields(
                { name: '📝 Current Settings', value: `**Prefix:** ${settings.prefix}\n**Default Volume:** ${settings.default_volume}%\n**Auto Disconnect:** ${settings.auto_disconnect ? 'Enabled' : 'Disabled'}\n**24/7 Mode:** ${settings.stay_in_vc ? 'Enabled' : 'Disabled'}`, inline: false },
                { name: '🎵 Music Features', value: '• High-quality audio streaming\n• YouTube support\n• Queue management\n• 16 audio filters', inline: true },
                { name: '💎 Premium Features', value: '• Unlimited usage\n• Priority support\n• Advanced filters\n• Custom settings', inline: true },
                { name: '🔧 Quick Commands', value: '• `help` - View all commands\n• `play <song>` - Start playing music\n• `set-prefix <prefix>` - Change prefix\n• `premium` - Manage premium', inline: false }
            )
            .addFields(
                { name: '🚀 Getting Started', value: '1. Join a voice channel\n2. Use `/play <song name>` to start\n3. Use `/help` for more commands\n4. Enjoy your music!', inline: false }
            )
            .setFooter({ text: 'Thanks for choosing our music bot!' })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};