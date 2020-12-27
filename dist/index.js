"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboard = exports.fetch = exports.removeXP = exports.addXP = void 0;
const db = require("quick.db");
const discord_js_1 = require("discord.js");
/**
 * Adds experience to the user
 * @param {any} message Parameter of your event message
 * @param {string} userID ID of the user
 * @param {number} XP The experience that will be added
 * @returns {any}
 */
function addXP(message, userID, XP) {
    if (!message)
        throw new Error("You must enter a message parameter, referring to your 'message' event");
    if (!userID)
        throw new Error("You must enter a userID parameter, corresponds to the ID of the user who will receive the experience");
    if (typeof userID !== "string")
        throw new Error("The userID parameter must be a String");
    if (!XP)
        throw new Error("You must enter an XP parameter, corresponds to the experience that will be added");
    if (XP <= 0)
        throw new Error("The XP parameter must be greater than 0");
    if (typeof XP !== "number")
        throw new Error("The XP parameter must be a Number");
    db.add(`xp_${message.guild.id}_${userID}`, XP);
}
exports.addXP = addXP;
;
/**
 * Remove experience to the user
 * @param {any} message Parameter of your event message
 * @param {string} userID ID of the user
 * @param {number} XP The experience that will be removed
 * @returns {any}
 */
function removeXP(message, userID, XP) {
    if (!message)
        throw new Error("You must enter a message parameter, referring to your 'message' event");
    if (!userID)
        throw new Error("You must enter a userID parameter, corresponds to the ID of the user who will loose the experience");
    if (typeof userID !== "string")
        throw new Error("The userID parameter must be a String");
    if (!XP)
        throw new Error("You must enter an XP parameter, corresponds to the experience that will be remove");
    if (XP <= 0)
        throw new Error("The XP parameter must be greater than 0");
    if (typeof XP !== "number")
        throw new Error("The XP parameter must be a Number");
    db.subtract(`xp_${message.guild.id}_${userID}`, XP);
}
exports.removeXP = removeXP;
;
/**
 * Allows you to obtain a user's information
 * @param {any} message Parameter of your event message
 * @param {string} userID ID of the user
 * @returns {any}
 */
function fetch(message, userID) {
    let embed;
    if (!message)
        throw new Error("You must enter a message parameter, referring to your 'message' event");
    if (!userID)
        throw new Error("You must enter a userID parameter, corresponds to the ID of the user");
    if (typeof userID !== "string")
        throw new Error("The userID parameter must be a String");
    const data = {
        level: db.get(`level_${message.guild.id}_${userID}`) || 1,
        xp: db.get(`xp_${message.guild.id}_${userID}`) || 0
    };
    message.guild.members.fetch(userID).then((m) => {
        embed = new discord_js_1.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(m.user.tag, m.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(m.user.displayAvatarURL({ dynamic: true }))
            .setDescription("**Level** : `" + data.level + "` \n**XP** : `" + data.xp + "`");
        message.channel.send(embed);
    }).catch(() => message.channel.send(":x: Unknown user ID."));
}
exports.fetch = fetch;
;
/**
 * Returns a ranking of the experience in the server
 * @param {any} client Discord.js Client
 * @param {any} message Parameter of your event message
 * @returns {any}
 */
function leaderboard(client, message) {
    if (!client)
        throw new Error("You must enter a client parameter (discord.js client)");
    if (!message)
        throw new Error("You must enter a message parameter, referring to your 'message' event");
    let data = db.all().filter(i => i.ID.startsWith("xp_")).sort((a, b) => b.data - a.data);
    if (data.length < 1)
        return message.channel.send("It seems that there is no data");
    let authorRank = data.map(i => i.ID).indexOf(`xp_${message.guild.id}_${message.author.id}`) + 1 || "N/A";
    let leaderboard = [];
    for (let i in data) {
        let id = data[i].ID.split("_")[2];
        let user = client.users.cache.get(id);
        let level = db.get(`level_${message.guild.id}_${id}`);
        leaderboard.push({
            user: (user !== undefined || !user) ? user.tag : "Unknown#0000",
            rank: data.indexOf(data[i]) + 1,
            level: level !== null ? level : "Unknown",
            xp: data[i].data ? data[i].data : "Unkown"
        });
    }
    ;
    const embed = new discord_js_1.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("🙄 Leaderboard");
    leaderboard.forEach(x => {
        embed.addField(`➔ \`${x.rank}\` • **${x.user}**`, `__Level:__ **\`${x.level}\`** • __XP:__ **\`${x.xp}\`**`, false);
    });
    embed.setFooter("You are at the position " + authorRank, message.guild.iconURL({ dynamic: true }));
    message.channel.send(embed);
}
exports.leaderboard = leaderboard;
;
