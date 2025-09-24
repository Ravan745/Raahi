const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Display user avatar',
    aliases: ['av', 'pfp'],
    
    slashCommand: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Display user avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to get avatar from (optional)')
        ),

    async execute(message, args, client) {
        let targetUser;
        
        if (args[0]) {
            const userMention = args[0];
            if (userMention.startsWith('<@')) {
                const userId = userMention.replace(/[<@!>]/g, '');
                targetUser = await client.users.fetch(userId).catch(() => null);
            } else {
                targetUser = message.guild.members.cache.find(m => 
                    m.user.username.toLowerCase().includes(args[0].toLowerCase()) ||
                    m.displayName.toLowerCase().includes(args[0].toLowerCase())
                )?.user;
            }
        }
        
        if (!targetUser) {
            targetUser = message.author;
        }

        const embed = new EmbedBuilder()
            .setColor('#00d4aa')
            .setTitle(`${targetUser.tag}'s Avatar`)
            .setImage(targetUser.displayAvatarURL({ size: 512, extension: 'png' }))
            .addFields({
                name: 'Links',
                value: `[PNG](${targetUser.displayAvatarURL({ size: 512, extension: 'png' })}) • [JPG](${targetUser.displayAvatarURL({ size: 512, extension: 'jpg' })}) • [WEBP](${targetUser.displayAvatarURL({ size: 512, extension: 'webp' })})`
            })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const targetUser = interaction.options.getUser('user') || interaction.user;

        const embed = new EmbedBuilder()
            .setColor('#00d4aa')
            .setTitle(`${targetUser.tag}'s Avatar`)
            .setImage(targetUser.displayAvatarURL({ size: 512, extension: 'png' }))
            .addFields({
                name: 'Links',
                value: `[PNG](${targetUser.displayAvatarURL({ size: 512, extension: 'png' })}) • [JPG](${targetUser.displayAvatarURL({ size: 512, extension: 'jpg' })}) • [WEBP](${targetUser.displayAvatarURL({ size: 512, extension: 'webp' })})`
            })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};