"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboard = exports.addXP = void 0;
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
    return db.get(`xp_${message.guild.id}_${userID}`);
}
exports.addXP = addXP;
;
/**
 * Returns a ranking of the experience in the server
 * @param {any} client Discord.js Client
 * @param {any} message Parameter of your event message
 * @param {object} options Object containing options
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
