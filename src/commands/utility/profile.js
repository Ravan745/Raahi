const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'profile',
    description: 'View your music profile and statistics',
    
    slashCommand: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View your music profile and statistics')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to view profile for (optional)')
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

        const userStats = client.db.getUserStats(targetUser.id, message.guild.id) || {
            songs_played: 0,
            time_listened: 0,
            commands_used: 0,
            last_active: Math.floor(Date.now() / 1000)
        };

        const premium = client.db.getPremiumUser(targetUser.id, message.guild.id);
        const isPremium = premium && premium.expires_at > Math.floor(Date.now() / 1000);

        const embed = new EmbedBuilder()
            .setColor(isPremium ? '#FFD700' : '#00d4aa')
            .setTitle(`🎵 ${targetUser.tag}'s Music Profile`)
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                {
                    name: '📊 Music Statistics',
                    value: `**Songs Played:** ${userStats.songs_played}\n**Time Listened:** ${this.formatTime(userStats.time_listened)}\n**Commands Used:** ${userStats.commands_used}`,
                    inline: true
                },
                {
                    name: '💎 Membership Status',
                    value: isPremium ? 
                        `**Premium Member** ✨\n**Credits:** ${premium.credits}\n**Expires:** <t:${premium.expires_at}:R>` :
                        '**Free User**\nUpgrade to Premium for unlimited features!',
                    inline: true
                },
                {
                    name: '📅 Activity',
                    value: `**Last Active:** <t:${userStats.last_active}:R>\n**Member Since:** <t:${Math.floor(targetUser.createdTimestamp / 1000)}:d>`,
                    inline: true
                }
            );

        // Add achievement/badge system
        const achievements = this.getAchievements(userStats, isPremium);
        if (achievements.length > 0) {
            embed.addFields({
                name: '🏆 Achievements',
                value: achievements.join(' '),
                inline: false
            });
        }

        // Add favorite genres or recent songs (placeholder)
        embed.addFields({
            name: '🎶 Music Preferences',
            value: 'Feature coming soon! Track your favorite genres and artists.',
            inline: false
        });

        embed.setFooter({ text: `User ID: ${targetUser.id}` })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const targetUser = interaction.options.getUser('user') || interaction.user;

        const userStats = client.db.getUserStats(targetUser.id, interaction.guild.id) || {
            songs_played: 0,
            time_listened: 0,
            commands_used: 0,
            last_active: Math.floor(Date.now() / 1000)
        };

        const premium = client.db.getPremiumUser(targetUser.id, interaction.guild.id);
        const isPremium = premium && premium.expires_at > Math.floor(Date.now() / 1000);

        const embed = new EmbedBuilder()
            .setColor(isPremium ? '#FFD700' : '#00d4aa')
            .setTitle(`🎵 ${targetUser.tag}'s Music Profile`)
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                {
                    name: '📊 Music Statistics',
                    value: `**Songs Played:** ${userStats.songs_played}\n**Time Listened:** ${this.formatTime(userStats.time_listened)}\n**Commands Used:** ${userStats.commands_used}`,
                    inline: true
                },
                {
                    name: '💎 Membership Status',
                    value: isPremium ? 
                        `**Premium Member** ✨\n**Credits:** ${premium.credits}\n**Expires:** <t:${premium.expires_at}:R>` :
                        '**Free User**\nUpgrade to Premium for unlimited features!',
                    inline: true
                },
                {
                    name: '📅 Activity',
                    value: `**Last Active:** <t:${userStats.last_active}:R>\n**Member Since:** <t:${Math.floor(targetUser.createdTimestamp / 1000)}:d>`,
                    inline: true
                }
            );

        // Add achievement/badge system
        const achievements = this.getAchievements(userStats, isPremium);
        if (achievements.length > 0) {
            embed.addFields({
                name: '🏆 Achievements',
                value: achievements.join(' '),
                inline: false
            });
        }

        // Add favorite genres or recent songs (placeholder)
        embed.addFields({
            name: '🎶 Music Preferences',
            value: 'Feature coming soon! Track your favorite genres and artists.',
            inline: false
        });

        embed.setFooter({ text: `User ID: ${targetUser.id}` })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },

    formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    },

    getAchievements(stats, isPremium) {
        const achievements = [];
        
        if (stats.songs_played >= 100) achievements.push('🎵');
        if (stats.songs_played >= 500) achievements.push('🎶');
        if (stats.songs_played >= 1000) achievements.push('🎼');
        
        if (stats.time_listened >= 3600000) achievements.push('⏰'); // 1 hour
        if (stats.time_listened >= 36000000) achievements.push('⏳'); // 10 hours
        
        if (stats.commands_used >= 50) achievements.push('🔧');
        if (stats.commands_used >= 200) achievements.push('⚡');
        
        if (isPremium) achievements.push('💎');
        
        return achievements;
    }
};