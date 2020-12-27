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
    db.add("xp_" + message.guild.id + "_" + userID, XP);
    return db.get("xp_" + message.guild.id + "_" + userID);
}
exports.addXP = addXP;
;
