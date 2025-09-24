const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'set-prefix',
    description: 'Change the bot command prefix',
    aliases: ['prefix', 'setprefix'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('set-prefix')
        .setDescription('Change the bot command prefix')
        .addStringOption(option =>
            option.setName('prefix')
                .setDescription('New command prefix')
                .setRequired(true)
                .setMaxLength(5)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Permission')
                .setDescription('You need Manage Server permission to change the prefix!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        if (!args[0]) {
            const currentPrefix = client.db.getPrefix(message.guild.id);
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('📝 Current Prefix')
                .setDescription(`Current prefix: \`${currentPrefix}\``)
                .addFields({
                    name: 'Usage',
                    value: `\`${currentPrefix}set-prefix <new_prefix>\``
                })
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const newPrefix = args[0];

        if (newPrefix.length > 5) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Invalid Prefix')
                .setDescription('Prefix must be 5 characters or less!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const oldPrefix = client.db.getPrefix(message.guild.id);
        client.db.setPrefix(message.guild.id, newPrefix);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('✅ Prefix Updated')
            .setDescription(`Prefix changed from \`${oldPrefix}\` to \`${newPrefix}\``)
            .addFields({
                name: 'Example Usage',
                value: `\`${newPrefix}play <song>\``
            })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Permission')
                .setDescription('You need Manage Server permission to change the prefix!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const newPrefix = interaction.options.getString('prefix');
        const oldPrefix = client.db.getPrefix(interaction.guild.id);
        
        client.db.setPrefix(interaction.guild.id, newPrefix);

        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('✅ Prefix Updated')
            .setDescription(`Prefix changed from \`${oldPrefix}\` to \`${newPrefix}\``)
            .addFields({
                name: 'Example Usage',
                value: `\`${newPrefix}play <song>\``
            })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};