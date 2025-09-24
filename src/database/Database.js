const Database = require('better-sqlite3');
const path = require('path');
const chalk = require('chalk');

class BotDatabase {
    constructor() {
        this.db = new Database(path.join(__dirname, '../../data/bot.db'));
        this.initializeTables();
    }

    initializeTables() {
        try {
            // Premium users table
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS premium_users (
                    user_id TEXT PRIMARY KEY,
                    guild_id TEXT,
                    credits INTEGER DEFAULT 0,
                    expires_at INTEGER,
                    granted_by TEXT,
                    granted_at INTEGER DEFAULT (strftime('%s', 'now')),
                    UNIQUE(user_id, guild_id)
                )
            `);

            // Guild settings table
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS guild_settings (
                    guild_id TEXT PRIMARY KEY,
                    prefix TEXT DEFAULT '!',
                    default_volume INTEGER DEFAULT 50,
                    auto_disconnect BOOLEAN DEFAULT true,
                    stay_in_vc BOOLEAN DEFAULT false,
                    premium_only BOOLEAN DEFAULT false
                )
            `);

            // User stats table
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS user_stats (
                    user_id TEXT,
                    guild_id TEXT,
                    songs_played INTEGER DEFAULT 0,
                    time_listened INTEGER DEFAULT 0,
                    commands_used INTEGER DEFAULT 0,
                    last_active INTEGER DEFAULT (strftime('%s', 'now')),
                    PRIMARY KEY (user_id, guild_id)
                )
            `);

            // Music queue history
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS queue_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    guild_id TEXT,
                    user_id TEXT,
                    song_title TEXT,
                    song_url TEXT,
                    played_at INTEGER DEFAULT (strftime('%s', 'now'))
                )
            `);

            console.log(chalk.green('✓ Database tables initialized'));
        } catch (error) {
            console.error(chalk.red('Database initialization error:'), error);
        }
    }

    // Premium system methods
    addPremiumUser(userId, guildId, credits, duration, grantedBy) {
        const expiresAt = Math.floor(Date.now() / 1000) + duration;
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO premium_users 
            (user_id, guild_id, credits, expires_at, granted_by) 
            VALUES (?, ?, ?, ?, ?)
        `);
        return stmt.run(userId, guildId, credits, expiresAt, grantedBy);
    }

    getPremiumUser(userId, guildId) {
        const stmt = this.db.prepare('SELECT * FROM premium_users WHERE user_id = ? AND guild_id = ?');
        return stmt.get(userId, guildId);
    }

    updatePremiumCredits(userId, guildId, credits) {
        const stmt = this.db.prepare('UPDATE premium_users SET credits = ? WHERE user_id = ? AND guild_id = ?');
        return stmt.run(credits, userId, guildId);
    }

    // Guild settings methods
    getPrefix(guildId) {
        if (!guildId) return '!';
        const stmt = this.db.prepare('SELECT prefix FROM guild_settings WHERE guild_id = ?');
        const result = stmt.get(guildId);
        return result?.prefix || '!';
    }

    setPrefix(guildId, prefix) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO guild_settings (guild_id, prefix) 
            VALUES (?, ?)
        `);
        return stmt.run(guildId, prefix);
    }

    getGuildSettings(guildId) {
        const stmt = this.db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?');
        return stmt.get(guildId) || {
            guild_id: guildId,
            prefix: '!',
            default_volume: 50,
            auto_disconnect: true,
            stay_in_vc: false,
            premium_only: false
        };
    }

    updateGuildSettings(guildId, settings) {
        const fields = Object.keys(settings).join(' = ?, ') + ' = ?';
        const values = Object.values(settings);
        const stmt = this.db.prepare(`UPDATE guild_settings SET ${fields} WHERE guild_id = ?`);
        return stmt.run(...values, guildId);
    }

    // User stats methods
    addUserStats(userId, guildId, type, value = 1) {
        const column = type === 'song' ? 'songs_played' : type === 'time' ? 'time_listened' : 'commands_used';
        const stmt = this.db.prepare(`
            INSERT INTO user_stats (user_id, guild_id, ${column}) 
            VALUES (?, ?, ?) 
            ON CONFLICT(user_id, guild_id) 
            DO UPDATE SET ${column} = ${column} + ?, last_active = strftime('%s', 'now')
        `);
        return stmt.run(userId, guildId, value, value);
    }

    getUserStats(userId, guildId) {
        const stmt = this.db.prepare('SELECT * FROM user_stats WHERE user_id = ? AND guild_id = ?');
        return stmt.get(userId, guildId);
    }

    // Queue history methods
    addToHistory(guildId, userId, songTitle, songUrl) {
        const stmt = this.db.prepare(`
            INSERT INTO queue_history (guild_id, user_id, song_title, song_url) 
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(guildId, userId, songTitle, songUrl);
    }

    getHistory(guildId, limit = 10) {
        const stmt = this.db.prepare(`
            SELECT * FROM queue_history 
            WHERE guild_id = ? 
            ORDER BY played_at DESC 
            LIMIT ?
        `);
        return stmt.all(guildId, limit);
    }

    // Cleanup expired premium users
    cleanupExpiredPremium() {
        const now = Math.floor(Date.now() / 1000);
        const stmt = this.db.prepare('DELETE FROM premium_users WHERE expires_at < ?');
        return stmt.run(now);
    }
}

module.exports = BotDatabase;