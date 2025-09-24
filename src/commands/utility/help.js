const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Show help information and command list',
    
    slashCommand: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show help information and command list')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Command category to view')
                .addChoices(
                    { name: 'Music', value: 'music' },
                    { name: 'Filters', value: 'filters' },
                    { name: 'Utility', value: 'utility' },
                    { name: 'Information', value: 'information' }
                )
        ),

    async execute(message, args, client) {
        const category = args[0]?.toLowerCase();
        
        if (category) {
            return this.showCategory(message, category, client, false);
        }
        
        const embed = new EmbedBuilder()
            .setColor('#00d4aa')
            .setTitle('🎵 Discord Music Bot - Help')
            .setDescription('A comprehensive music bot with 51+ commands!')
            .addFields(
                {
                    name: '🎵 Music Commands (19)',
                    value: '`play`, `pause`, `skip`, `stop`, `queue`, `nowplaying`, `volume`, `loop`, `shuffle`, `clearqueue`, `connect`, `disconnect`, `previous`, `replay`, `remove`, `move`, `seek`, `lyrics`',
                    inline: false
                },
                {
                    name: '🎚️ Audio Filters (16)',
                    value: '`8d`, `bassboost`, `nightcore`, `vaporwave`, `karaoke`, `chipmunk`, `daycore`, `distortion`, `earrape`, `tremolo`, `vibrato`, `china`, `pop`, `soft`, `treblebass`, `clearfilters`',
                    inline: false
                },
                {
                    name: '🛠️ Utility Commands (10)',
                    value: '`help`, `setup`, `set-prefix`, `247`, `afk`, `autoplay`, `avatar`, `ignore`, `premium`, `profile`',
                    inline: false
                },
                {
                    name: '📊 Information Commands (6)',
                    value: '`about`, `invite`, `latency`, `stats`, `support`, `vote`',
                    inline: false
                }
            )
            .addFields(
                {
                    name: '💎 Premium Features',
                    value: 'Get premium access for unlimited usage and special features!',
                    inline: false
                },
                {
                    name: '🔗 Quick Links',
                    value: '[Support Server](https://discord.gg/support) • [Invite Bot](https://discord.com/oauth2/authorize) • [Vote](https://top.gg/bot)',
                    inline: false
                }
            )
            .setFooter({ text: 'Use help <category> for detailed command info' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },

    async executeSlash(interaction, client) {
        const category = interaction.options.getString('category');
        
        if (category) {
            return this.showCategory(interaction, category, client, true);
        }
        
        const embed = new EmbedBuilder()
            .setColor('#00d4aa')
            .setTitle('🎵 Discord Music Bot - Help')
            .setDescription('A comprehensive music bot with 51+ commands!')
            .addFields(
                {
                    name: '🎵 Music Commands (19)',
                    value: '`play`, `pause`, `skip`, `stop`, `queue`, `nowplaying`, `volume`, `loop`, `shuffle`, `clearqueue`, `connect`, `disconnect`, `previous`, `replay`, `remove`, `move`, `seek`, `lyrics`',
                    inline: false
                },
                {
                    name: '🎚️ Audio Filters (16)',
                    value: '`8d`, `bassboost`, `nightcore`, `vaporwave`, `karaoke`, `chipmunk`, `daycore`, `distortion`, `earrape`, `tremolo`, `vibrato`, `china`, `pop`, `soft`, `treblebass`, `clearfilters`',
                    inline: false
                },
                {
                    name: '🛠️ Utility Commands (10)',
                    value: '`help`, `setup`, `set-prefix`, `247`, `afk`, `autoplay`, `avatar`, `ignore`, `premium`, `profile`',
                    inline: false
                },
                {
                    name: '📊 Information Commands (6)',
                    value: '`about`, `invite`, `latency`, `stats`, `support`, `vote`',
                    inline: false
                }
            )
            .addFields(
                {
                    name: '💎 Premium Features',
                    value: 'Get premium access for unlimited usage and special features!',
                    inline: false
                },
                {
                    name: '🔗 Quick Links',
                    value: '[Support Server](https://discord.gg/support) • [Invite Bot](https://discord.com/oauth2/authorize) • [Vote](https://top.gg/bot)',
                    inline: false
                }
            )
            .setFooter({ text: 'Use help <category> for detailed command info' })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },

    showCategory(ctx, category, client, isSlash) {
        const embeds = {
            music: new EmbedBuilder()
                .setColor('#00d4aa')
                .setTitle('🎵 Music Commands')
                .setDescription('Control music playback and queue management')
                .addFields(
                    { name: '▶️ Basic Controls', value: '`play` - Play a song\n`pause` - Pause current song\n`resume` - Resume paused song\n`stop` - Stop music and clear queue\n`skip` - Skip current song', inline: true },
                    { name: '📋 Queue Management', value: '`queue` - Show current queue\n`clearqueue` - Clear the queue\n`shuffle` - Shuffle queue\n`remove` - Remove song from queue\n`move` - Move song position', inline: true },
                    { name: '🎛️ Advanced Controls', value: '`volume` - Adjust volume\n`loop` - Toggle loop modes\n`seek` - Seek to time\n`replay` - Restart current song\n`previous` - Play previous song', inline: true },
                    { name: '📊 Information', value: '`nowplaying` - Current song info\n`lyrics` - Get song lyrics', inline: true },
                    { name: '🔌 Connection', value: '`connect` - Join voice channel\n`disconnect` - Leave voice channel', inline: true }
                ),
            
            filters: new EmbedBuilder()
                .setColor('#00d4aa')
                .setTitle('🎚️ Audio Filters')
                .setDescription('Apply various audio effects to your music')
                .addFields(
                    { name: '🎭 Popular Filters', value: '`8d` - 8D surround sound\n`bassboost` - Enhanced bass\n`nightcore` - High pitch/fast\n`vaporwave` - Slow/dreamy\n`karaoke` - Vocal reduction', inline: true },
                    { name: '🎪 Fun Filters', value: '`chipmunk` - High pitched\n`daycore` - Low pitch/slow\n`distortion` - Audio distortion\n`earrape` - Very loud\n`china` - Traditional effect', inline: true },
                    { name: '🎵 Audio Enhancement', value: '`tremolo` - Volume oscillation\n`vibrato` - Pitch oscillation\n`pop` - Pop music optimized\n`soft` - Gentle/mellow\n`treblebass` - Enhanced highs/lows', inline: true },
                    { name: '🗑️ Management', value: '`clearfilters` - Remove all active filters', inline: true }
                ),
            
            utility: new EmbedBuilder()
                .setColor('#00d4aa')
                .setTitle('🛠️ Utility Commands')
                .setDescription('Bot configuration and user utilities')
                .addFields(
                    { name: '⚙️ Bot Setup', value: '`setup` - Initial bot setup\n`set-prefix` - Change command prefix\n`247` - 24/7 mode toggle', inline: true },
                    { name: '👤 User Features', value: '`avatar` - Show user avatar\n`profile` - User music profile\n`afk` - Set AFK status', inline: true },
                    { name: '💎 Premium', value: '`premium` - Premium commands\n`ignore` - Ignore user from using bot', inline: true },
                    { name: '📚 Help', value: '`help` - Show this help menu\n`autoplay` - Toggle autoplay mode', inline: true }
                ),
            
            information: new EmbedBuilder()
                .setColor('#00d4aa')
                .setTitle('📊 Information Commands')
                .setDescription('Bot statistics and information')
                .addFields(
                    { name: '🤖 Bot Info', value: '`about` - About the bot\n`latency` - Bot ping/latency\n`stats` - Bot statistics', inline: true },
                    { name: '🔗 Links', value: '`invite` - Invite bot to server\n`support` - Support server link\n`vote` - Vote for the bot', inline: true }
                )
        };

        const embed = embeds[category];
        if (!embed) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Invalid Category')
                .setDescription('Valid categories: `music`, `filters`, `utility`, `information`');
            
            return isSlash ? ctx.reply({ embeds: [errorEmbed], ephemeral: true }) : ctx.reply({ embeds: [errorEmbed] });
        }

        return isSlash ? ctx.reply({ embeds: [embed] }) : ctx.reply({ embeds: [embed] });
    }
};