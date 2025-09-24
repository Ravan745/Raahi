const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ignore',
    description: 'Ignore/unignore a user from using the bot',
    
    slashCommand: new SlashCommandBuilder()
        .setName('ignore')
        .setDescription('Ignore/unignore a user from using the bot')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to ignore/unignore')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Permission')
                .setDescription('You need Manage Server permission to ignore users!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No User Provided')
                .setDescription('Please mention a user to ignore/unignore!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const userMention = args[0];
        if (!userMention.startsWith('<@')) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Invalid User')
                .setDescription('Please mention a valid user!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const userId = userMention.replace(/[<@!>]/g, '');
        const targetUser = await client.users.fetch(userId).catch(() => null);

        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ User Not Found')
                .setDescription('Could not find the specified user!')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // Initialize ignored users map if it doesn't exist
        if (!client.ignoredUsers) client.ignoredUsers = new Map();
        
        const isIgnored = client.ignoredUsers.has(userId);
        
        if (isIgnored) {
            client.ignoredUsers.delete(userId);
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('✅ User Unignored')
                .setDescription(`${targetUser.tag} can now use the bot again!`)
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        } else {
            client.ignoredUsers.set(userId, {
                ignoredBy: message.author.id,
                ignoredAt: Date.now(),
                guildId: message.guild.id
            });
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🚫 User Ignored')
                .setDescription(`${targetUser.tag} is now ignored and cannot use the bot!`)
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }
    },

    async executeSlash(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Permission')
                .setDescription('You need Manage Server permission to ignore users!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        
        // Initialize ignored users map if it doesn't exist
        if (!client.ignoredUsers) client.ignoredUsers = new Map();
        
        const isIgnored = client.ignoredUsers.has(targetUser.id);
        
        if (isIgnored) {
            client.ignoredUsers.delete(targetUser.id);
            const embed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle('✅ User Unignored')
                .setDescription(`${targetUser.tag} can now use the bot again!`)
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } else {
            client.ignoredUsers.set(targetUser.id, {
                ignoredBy: interaction.user.id,
                ignoredAt: Date.now(),
                guildId: interaction.guild.id
            });
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('🚫 User Ignored')
                .setDescription(`${targetUser.tag} is now ignored and cannot use the bot!`)
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    }
};