import * as db from 'quick.db'
import { MessageEmbed } from 'discord.js'

/**
 * Adds experience to the user
 * @param {any} message Parameter of your event message
 * @param {string} userID ID of the user
 * @param {number} XP The experience that will be added
 * @returns {any}
 */
export function addXP (message: any, userID: string, XP: number) : any {
    if(!message) throw new Error("You must enter a message parameter, referring to your 'message' event");
    
    if(!userID) throw new Error("You must enter a userID parameter, corresponds to the ID of the user who will receive the experience");
    if(typeof userID !== "string") throw new Error("The userID parameter must be a String")

    if(!XP) throw new Error("You must enter an XP parameter, corresponds to the experience that will be added");
    if(XP <= 0) throw new Error("The XP parameter must be greater than 0")
    if(typeof XP !== "number") throw new Error("The XP parameter must be a Number")

    db.add(`xp_${message.guild.id}_${userID}`, XP);
    return db.get(`xp_${message.guild.id}_${userID}`);
};

/**
 * Returns a ranking of the experience in the server
 * @param {any} client Discord.js Client 
 * @param {any} message Parameter of your event message
 * @param {object} options Object containing options
 */
export function leaderboard (client: any, message: any, limit: number) : any {
    if(!client) throw new Error("You must enter a client parameter (discord.js client)");

    if(!message) throw new Error("You must enter a message parameter, referring to your 'message' event");

    if(!limit) limit = 10;
    if(typeof limit !== "number") throw new Error("The limit option must be a Number");

    let data = db.all().filter(i => i.ID.startsWith("xp_")).slice(0, limit).sort((a, b) => b.data - a.data);
    if(data.length < 1) return message.channel.send("It seems that there is no data");
    let authorRank = data.map(i => i.ID).indexOf(`xp_${message.author.id}`);
    let leaderboard = [];
    
    for (let i in data) {
        let id = data[i].ID.split("_")[1];
        let user = client.users.cache.get(id);
        user ? user.tag : "Unknown#0000";
        let rank = data.indexOf(data[i]) + 1;
        let level = db.get(`level_${i}`);
        level ? level : "Unknown";
        let xp = data[i].data;
        xp ? xp : "Unknown";
        leaderboard.push({
            user: user,
            rank: rank,
            level: level,
            xp: xp
        });
    };

    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("🙄 Leaderboard");

    leaderboard.forEach(x => {
        embed.addField(
            `➔ \`${x.rank}\` • **${x.user}**`,
            `__Level:__ **\`${x.level}\`** • __XP:__ **\`${x.xp}\`**`,
            false
        );
    });

    embed.setFooter("You are at the position " + authorRank, message.guild.iconURL({ dynamic: true }));

    message.channel.send(embed);

};