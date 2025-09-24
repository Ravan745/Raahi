const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

async function registerSlashCommands(client) {
    const commands = [];
    
    try {
        // Get all command files
        const commandFolders = fs.readdirSync('./src/commands');
        
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            
            for (const file of commandFiles) {
                try {
                    const command = require(`../commands/${folder}/${file}`);
                    if (command.slashCommand) {
                        // Convert to JSON to ensure it's valid
                        commands.push(command.slashCommand.toJSON());
                    }
                } catch (error) {
                    console.error(chalk.red(`Error loading command ${folder}/${file}:`), error);
                }
            }
        }
        
        console.log(chalk.yellow(`🔄 Registering ${commands.length} slash commands...`));
        
        // Ensure we have client ID
        const clientId = client.user?.id;
        if (!clientId) {
            throw new Error('Client user ID not available');
        }
        
        // Register commands using REST API
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        // Use guild-scoped commands during development to avoid Entry Point conflicts
        const guildId = process.env.GUILD_ID; // Set this in .env for testing
        
        if (guildId) {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands }
            );
        } else {
            // For global commands, handle Entry Point command conflict
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands }
            );
        }
        
        console.log(chalk.green(`✓ Successfully registered ${commands.length} slash commands!`));
        
    } catch (error) {
        console.error(chalk.red('Error registering slash commands:'), error);
        // Don't throw error to prevent bot from crashing
    }
}

module.exports = { registerSlashCommands };