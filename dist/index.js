"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addXP = void 0;
var db = require("quick.db");
/**
 * Ajoute de l'expérience à l'utilisateur
 * @param {any} message Paramètre de votre événnement message
 * @param {string} userID L'identifiant de l'utilisateur
 * @param {number} XP L'expérience qui sera ajoutée
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
    db.add("xp_" + message.guild.id + "_" + userID, XP);
    return db.get("xp_" + message.guild.id + "_" + userID);
}
exports.addXP = addXP;
;
