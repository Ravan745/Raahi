const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'premium',
    description: 'Manage premium memberships',
    
    slashCommand: new SlashCommandBuilder()
        .setName('premium')
        .setDescription('Manage premium memberships')
        .addSubcommand(subcommand =>
            subcommand
                .setName('check')
                .setDescription('Check your premium status')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('give')
                .setDescription('Give premium to a user (Owner only)')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to give premium to')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('credits')
                        .setDescription('Number of credits to give')
                        .setRequired(true)
                        .setMinValue(1)
                )
                .addIntegerOption(option =>
                    option.setName('duration')
                        .setDescription('Duration in days')
                        .setRequired(true)
                        .setMinValue(1)
                )
        ),

    async execute(message, args, client) {
        const subcommand = args[0]?.toLowerCase();

        if (!subcommand || subcommand === 'check') {
            return this.checkPremium(message, client, false);
        }

        if (subcommand === 'give') {
            return this.givePremium(message, args.slice(1), client, false);
        }

        const embed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('❌ Invalid Subcommand')
            .setDescription('Valid subcommands: `check`, `give`')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'check') {
            return this.checkPremium(interaction, client, true);
        }

        if (subcommand === 'give') {
            return this.givePremium(interaction, null, client, true);
        }
    },

    async checkPremium(ctx, client, isSlash) {
        const userId = isSlash ? ctx.user.id : ctx.author.id;
        const guildId = isSlash ? ctx.guild.id : ctx.guild.id;
        
        const premium = client.db.getPremiumUser(userId, guildId);

        if (!premium || premium.expires_at < Math.floor(Date.now() / 1000)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('💎 Premium Status')
                .setDescription('You do not have premium access.')
                .addFields(
                    { name: '🚀 Get Premium', value: 'Contact server admins or bot owner for premium access!', inline: false },
                    { name: '✨ Premium Benefits', value: '• Unlimited usage\n• Priority support\n• Advanced filters\n• Custom settings', inline: false }
                )
                .setTimestamp();

            return isSlash ? ctx.reply({ embeds: [embed] }) : ctx.reply({ embeds: [embed] });
        }

        const expiresAt = new Date(premium.expires_at * 1000);
        const timeLeft = expiresAt.getTime() - Date.now();
        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('💎 Premium Status - Active!')
            .setDescription('You have premium access!')
            .addFields(
                { name: '💳 Credits', value: `${premium.credits} remaining`, inline: true },
                { name: '⏰ Time Left', value: `${daysLeft} days`, inline: true },
                { name: '👤 Granted By', value: `<@${premium.granted_by}>`, inline: true }
            )
            .setTimestamp();

        return isSlash ? ctx.reply({ embeds: [embed] }) : ctx.reply({ embeds: [embed] });
    },

    async givePremium(ctx, args, client, isSlash) {
        const ownerId = process.env.BOT_OWNER_ID || '123456789'; // Set your Discord ID
        const executorId = isSlash ? ctx.user.id : ctx.author.id;

        if (executorId !== ownerId && !isSlash ? !ctx.member.permissions.has(PermissionFlagsBits.Administrator) : !ctx.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ No Permission')
                .setDescription('Only the bot owner or administrators can give premium!')
                .setTimestamp();

            return isSlash ? ctx.reply({ embeds: [embed], ephemeral: true }) : ctx.reply({ embeds: [embed] });
        }

        let targetUser, credits, duration;

        if (isSlash) {
            targetUser = ctx.options.getUser('user');
            credits = ctx.options.getInteger('credits');
            duration = ctx.options.getInteger('duration') * 24 * 60 * 60; // Convert days to seconds
        } else {
            if (args.length < 3) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Invalid Usage')
                    .setDescription('Usage: `premium give <@user> <credits> <days>`')
                    .setTimestamp();

                return ctx.reply({ embeds: [embed] });
            }

            const userMention = args[0];
            credits = parseInt(args[1]);
            duration = parseInt(args[2]) * 24 * 60 * 60; // Convert days to seconds

            if (!userMention.startsWith('<@') || isNaN(credits) || isNaN(duration)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Invalid Parameters')
                    .setDescription('Please provide valid user mention, credits, and duration!')
                    .setTimestamp();

                return ctx.reply({ embeds: [embed] });
            }

            const userId = userMention.replace(/[<@!>]/g, '');
            targetUser = await client.users.fetch(userId).catch(() => null);
        }

        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ User Not Found')
                .setDescription('Could not find the specified user!')
                .setTimestamp();

            return isSlash ? ctx.reply({ embeds: [embed], ephemeral: true }) : ctx.reply({ embeds: [embed] });
        }

        const guildId = isSlash ? ctx.guild.id : ctx.guild.id;
        const grantedBy = isSlash ? ctx.user.id : ctx.author.id;

        client.db.addPremiumUser(targetUser.id, guildId, credits, duration, grantedBy);

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('✅ Premium Granted!')
            .setDescription(`Premium access granted to ${targetUser}!`)
            .addFields(
                { name: '💳 Credits', value: credits.toString(), inline: true },
                { name: '⏰ Duration', value: `${duration / (24 * 60 * 60)} days`, inline: true },
                { name: '👤 Granted By', value: isSlash ? ctx.user.toString() : ctx.author.toString(), inline: true }
            )
            .setTimestamp();

        return isSlash ? ctx.reply({ embeds: [embed] }) : ctx.reply({ embeds: [embed] });
    }
};