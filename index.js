require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const Database = require('./src/database/Database');
const { registerSlashCommands } = require('./src/utils/registerCommands');
const chalk = require('chalk');

// Create client with all necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

// Initialize collections
client.commands = new Collection();
client.musicQueues = new Collection();
client.voiceConnections = new Collection();
client.audioPlayers = new Collection();
client.premiumUsers = new Collection();

// Initialize database
client.db = new Database();

// Load commands
const loadCommands = () => {
    const commandFolders = fs.readdirSync('./src/commands');
    
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const command = require(`./src/commands/${folder}/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
                console.log(chalk.green(`✓ Loaded command: ${command.name}`));
            }
        }
    }
};

// Load events
const loadEvents = () => {
    const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
        const event = require(`./src/events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        console.log(chalk.blue(`✓ Loaded event: ${event.name}`));
    }
};

// Message handler for no-prefix commands
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // Check for no-prefix commands
    const noPrefixCommands = ['play', 'skip', 'stop', 'pause', 'resume', 'queue', 'nowplaying'];
    const messageContent = message.content.toLowerCase().trim();
    
    for (const cmdName of noPrefixCommands) {
        if (messageContent.startsWith(cmdName)) {
            const command = client.commands.get(cmdName);
            if (command) {
                try {
                    const args = message.content.slice(cmdName.length).trim().split(/ +/);
                    await command.execute(message, args, client);
                    return;
                } catch (error) {
                    console.error(chalk.red(`Error executing no-prefix command ${cmdName}:`), error);
                }
            }
        }
    }
    
    // Check for prefix commands
    const prefix = client.db.getPrefix(message.guild?.id) || '!';
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    
    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(chalk.red(`Error executing command ${commandName}:`), error);
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('❌ Command Error')
            .setDescription('There was an error executing this command.')
            .setTimestamp();
        
        await message.reply({ embeds: [errorEmbed] });
    }
});

// Slash command handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    
    try {
        await command.executeSlash(interaction, client);
    } catch (error) {
        console.error(chalk.red(`Error executing slash command ${interaction.commandName}:`), error);
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('❌ Command Error')
            .setDescription('There was an error executing this command.')
            .setTimestamp();
        
        const reply = { embeds: [errorEmbed], ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(reply);
        } else {
            await interaction.reply(reply);
        }
    }
});

// Ready event
client.once('ready', async () => {
    console.log(chalk.green.bold(`🎵 ${client.user.tag} is online!`));
    
    // Set activity
    client.user.setActivity('🎵 Music for everyone!', { type: ActivityType.Listening });
    
    // Register slash commands after ensuring client is ready
    setTimeout(async () => {
        if (client.user?.id) {
            await registerSlashCommands(client);
        } else {
            console.log(chalk.yellow('⏳ Client not ready, retrying in 3 seconds...'));
            setTimeout(async () => {
                await registerSlashCommands(client);
            }, 3000);
        }
    }, 3000);
    
    console.log(chalk.cyan(`📊 Serving ${client.guilds.cache.size} servers`));
});

// Load everything
console.log(chalk.yellow('🔄 Loading commands...'));
loadCommands();

console.log(chalk.yellow('🔄 Loading events...'));
loadEvents();

// Login
client.login(process.env.DISCORD_TOKEN).catch(console.error);

module.exports = client;