import * as db from 'quick.db'
import { MessageEmbed, MessageAttachment } from 'discord.js'
import * as canvas from 'canvas-constructor'

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
    if(typeof userID !== "string") throw new Error("The userID parameter must be a String");

    if(!XP) throw new Error("You must enter an XP parameter, corresponds to the experience that will be added");
    if(XP <= 0) throw new Error("The XP parameter must be greater than 0");
    if(typeof XP !== "number") throw new Error("The XP parameter must be a Number");

    db.add(`xp_${message.guild.id}_${userID}`, XP);
};

/**
 * Remove experience to the user
 * @param {any} message Parameter of your event message 
 * @param {string} userID ID of the user 
 * @param {number} XP The experience that will be removed
 * @returns {any}
 */
export function removeXP (message: any, userID: string, XP: number) : any {
    if(!message) throw new Error("You must enter a message parameter, referring to your 'message' event");
    
    if(!userID) throw new Error("You must enter a userID parameter, corresponds to the ID of the user who will loose the experience");
    if(typeof userID !== "string") throw new Error("The userID parameter must be a String");

    if(!XP) throw new Error("You must enter an XP parameter, corresponds to the experience that will be remove");
    if(XP <= 0) throw new Error("The XP parameter must be greater than 0");
    if(typeof XP !== "number") throw new Error("The XP parameter must be a Number");

    db.subtract(`xp_${message.guild.id}_${userID}`, XP);
};

/**
 * Allows you to obtain a user's information
 * @param {any} message Parameter of your event message 
 * @param {string} userID ID of the user
 * @returns {any}
 */
export function fetch (message: any, userID: string) : any {
    let embed;

    if(!message) throw new Error("You must enter a message parameter, referring to your 'message' event");
    
    if(!userID) throw new Error("You must enter a userID parameter, corresponds to the ID of the user");
    if(typeof userID !== "string") throw new Error("The userID parameter must be a String");

    const data = {
        level: db.get(`level_${message.guild.id}_${userID}`) || 1,
        xp: db.get(`xp_${message.guild.id}_${userID}`) || 0
    };

    message.guild.members.fetch(userID).then((m: any) => {
        embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(m.user.tag, m.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(m.user.displayAvatarURL({ dynamic: true }))
            .setDescription("**Level** : `" + data.level + "` \n**XP** : `" + data.xp + "`")

        message.channel.send(embed);
    }).catch(() => message.channel.send(":x: Unknown user ID."))
};

/**
 * Returns a ranking of the experience in the server
 * @param {any} client Discord.js Client 
 * @param {any} message Parameter of your event message
 * @returns {any}
 */
export function leaderboard (client: any, message: any) : any {
    if(!client) throw new Error("You must enter a client parameter (discord.js client)");

    if(!message) throw new Error("You must enter a message parameter, referring to your 'message' event");

    let data = db.all().filter(i => i.ID.startsWith("level_")).sort((a, b) => b.data - a.data);
    if(data.length < 1) return message.channel.send("It seems that there is no data");
    let authorRank = data.map(i => i.ID).indexOf(`level_${message.guild.id}_${message.author.id}`) + 1 || "N/A";

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

/**
 * Returns a rankcard
 * @param {any} message Parameter of your event message
 * @param {string} userID The ID of the user
 * @returns {any}
 */
export function Rankcard (message: any, userID: string) : any {
    if(!message) throw new Error("You must enter a message parameter, referring to your 'message' event");
    
    if(!userID) throw new Error("You must enter a userID parameter, corresponds to the ID of the user");
    if(typeof userID !== "string") throw new Error("The userID parameter must be a String");

    message.guild.members.fetch(userID).then(async (m: any) => {
        let avatar = await canvas.resolveImage(m.user.displayAvatarURL({ dynamic: false, format: "png" }));

        const data = {
            level: db.get(`level_${message.guild.id}_${userID}`) || 1,
            xp: db.get(`xp_${message.guild.id}_${userID}`) || 1
        };

        let status = await canvas.resolveImage(`assets/status_${m.user.presence.status}.png`);
        let black = await canvas.resolveImage('assets/black.png');

        let userRank = db.all().filter(i => i.ID.startsWith("level_")).sort((a, b) => b.data - a.data).map(i => i.ID).indexOf(`level_${message.guild.id}_${userID}`) + 1 || "N/A";

        let image = new canvas.Canvas(500, 200)
            .setColor("#303133")
            .printRectangle(0, 0, 500, 200)
            .setColor("#fcfdff")
            .setTextAlign("center")
            .setTextSize(35)
            .printText((m.displayName.length > 15 ? m.displayName.substring(0, 12) + "..." : m.displayName) + "#" + m.user.discriminator, 250, 45)
            .printCircularImage(avatar, 70, 110, 50)
            .printCircularImage(black, 100, 140, 15)
            .printCircularImage(status, 100, 140, 20)
            .setColor(String(m.user.presence.status).replace("online", "#43b581").replace("idle", "#faa61a").replace("dnd", "#f04747").replace("offline", "#747f8d"))
            .printRoundedRectangle(130, 95, 350, 45, 15)
            .setColor("#303133")
            .printRoundedRectangle(132, 97, 346, 42, 15)
            .setColor("#fcfdff")
            .printRoundedRectangle(134, 99, ((data.xp/100)*340), 38, 15)
            .setColor("#fcfdff")
            .setTextAlign("left")
            .setTextSize(19)
            .printText(`Level : ${data.level} | XP : ${data.xp} / 100`, 10, 190);

        let colorRanks = {
            1: '#d1b94f',
            2: '#adaca6',
            3: '#96531d'
        };

        let color = (userRank === 1 || userRank === 2 || userRank === 3) ? colorRanks[userRank] : "#fcfdff"
        let size = image.measureText(`Rank #${userRank}`).width;
        await image.setColor(color).setTextAlign("left").setTextSize(21).printText(`Rank #${userRank}`, image.width-(size+20), 190)

        if(userRank === 1 || userRank === 2 || userRank === 3) {
            let userRank_img = await canvas.resolveImage(`assets/rank_${userRank}.png`);
            await image.printImage(userRank_img, 435, 8);
        };

        let attachment = new MessageAttachment(image.toBuffer(), "rank.png");

        message.channel.send(attachment)
    }).catch(() => message.channel.send(":x: Unknown user ID."));
}