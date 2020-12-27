import * as db from 'quick.db'

/**
 * Ajoute de l'expérience à l'utilisateur
 * @param {any} message Paramètre de votre événnement message
 * @param {string} userID L'identifiant de l'utilisateur
 * @param {number} XP L'expérience qui sera ajoutée
 * @returns {any}
 */

export function addXP (message: any, userID: string, XP: number) : any {
    db.add(`xp_${message.guild.id}_${userID}`, XP);
    return db.get(`xp_${message.guild.id}_${userID}`);
};