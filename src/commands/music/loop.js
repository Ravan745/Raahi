const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'loop',
    description: 'Toggle loop mode (off/song/queue)',
    aliases: ['repeat'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle loop mode')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Loop mode')
                .addChoices(
                    { name: 'Off', value: 'off' },
                    { name: 'Current Song', value: 'song' },
                    { name: 'Queue', value: 'queue' }
                )
        ),

    async execute(message, args, client) {
        const queue = client.musicQueues.get(message.guild.id);
        
        if (!queue) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Queue')
                .setDescription('There is no music queue for this server!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        let mode = args[0]?.toLowerCase();
        if (!mode) {
            // Toggle through modes
            mode = queue.loop === false ? 'song' : queue.loop === 'song' ? 'queue' : 'off';
        }

        if (!['off', 'song', 'queue'].includes(mode)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Invalid Mode')
                .setDescription('Valid modes: `off`, `song`, `queue`')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const loopMode = mode === 'off' ? false : mode;
        queue.setLoop(loopMode);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🔁 Loop Mode Changed')
            .setDescription(`Loop mode: **${mode === 'off' ? 'Off' : mode === 'song' ? 'Current Song' : 'Queue'}**`)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const queue = client.musicQueues.get(interaction.guild.id);
        
        if (!queue) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Queue')
                .setDescription('There is no music queue for this server!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let mode = interaction.options.getString('mode');
        if (!mode) {
            mode = queue.loop === false ? 'song' : queue.loop === 'song' ? 'queue' : 'off';
        }

        const loopMode = mode === 'off' ? false : mode;
        queue.setLoop(loopMode);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('🔁 Loop Mode Changed')
            .setDescription(`Loop mode: **${mode === 'off' ? 'Off' : mode === 'song' ? 'Current Song' : 'Queue'}**`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};