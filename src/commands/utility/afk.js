const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'afk',
    description: 'Set your AFK status',
    
    slashCommand: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set your AFK status')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for being AFK (optional)')
                .setMaxLength(100)
        ),

    async execute(message, args, client) {
        const reason = args.join(' ') || 'No reason provided';
        
        // Store AFK status in client cache (you could use database for persistence)
        if (!client.afkUsers) client.afkUsers = new Map();
        
        client.afkUsers.set(message.author.id, {
            reason: reason,
            timestamp: Date.now()
        });

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('😴 AFK Status Set')
            .setDescription(`You are now AFK: **${reason}**`)
            .addFields({
                name: '📝 Note',
                value: 'I will mention your AFK status when someone mentions you. Send any message to remove your AFK status.'
            })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        // Store AFK status in client cache
        if (!client.afkUsers) client.afkUsers = new Map();
        
        client.afkUsers.set(interaction.user.id, {
            reason: reason,
            timestamp: Date.now()
        });

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('😴 AFK Status Set')
            .setDescription(`You are now AFK: **${reason}**`)
            .addFields({
                name: '📝 Note',
                value: 'I will mention your AFK status when someone mentions you. Send any message to remove your AFK status.'
            })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};