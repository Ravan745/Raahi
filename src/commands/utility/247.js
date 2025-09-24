const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: '247',
    description: 'Toggle 24/7 mode (stay in voice channel)',
    aliases: ['24/7', 'stay'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('247')
        .setDescription('Toggle 24/7 mode (stay in voice channel)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Permission')
                .setDescription('You need Manage Server permission to toggle 24/7 mode!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const settings = client.db.getGuildSettings(message.guild.id);
        const newMode = !settings.stay_in_vc;
        
        client.db.updateGuildSettings(message.guild.id, { stay_in_vc: newMode });

        const embed = new EmbedBuilder()
            .setColor(newMode ? '#4CAF50' : '#ff6b6b')
            .setTitle(`${newMode ? '✅' : '❌'} 24/7 Mode ${newMode ? 'Enabled' : 'Disabled'}`)
            .setDescription(newMode ? 
                'The bot will now stay in voice channels 24/7 and won\'t auto-disconnect.' : 
                'The bot will now auto-disconnect when no one is listening.')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Permission')
                .setDescription('You need Manage Server permission to toggle 24/7 mode!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const settings = client.db.getGuildSettings(interaction.guild.id);
        const newMode = !settings.stay_in_vc;
        
        client.db.updateGuildSettings(interaction.guild.id, { stay_in_vc: newMode });

        const embed = new EmbedBuilder()
            .setColor(newMode ? '#4CAF50' : '#ff6b6b')
            .setTitle(`${newMode ? '✅' : '❌'} 24/7 Mode ${newMode ? 'Enabled' : 'Disabled'}`)
            .setDescription(newMode ? 
                'The bot will now stay in voice channels 24/7 and won\'t auto-disconnect.' : 
                'The bot will now auto-disconnect when no one is listening.')
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};