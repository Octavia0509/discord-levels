/**
 * Adds experience to the user
 * @param {any} message Parameter of your event message
 * @param {string} userID ID of the user
 * @param {number} XP The experience that will be added
 * @returns {any}
 */
export declare function addXP(message: any, userID: string, XP: number): any;
/**
 * Returns a ranking of the experience in the server
 * @param {any} client Discord.js Client
 * @param {any} message Parameter of your event message
 * @param {object} options Object containing options
 */
export declare function leaderboard(client: any, message: any, limit: number): any;
