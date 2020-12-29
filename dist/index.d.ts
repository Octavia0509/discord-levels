/**
 * Adds experience to the user
 * @param {any} message Parameter of your event message
 * @param {string} userID ID of the user
 * @param {number} XP The experience that will be added
 * @returns {any}
 */
export declare function addXP(message: any, userID: string, XP: number): any;
/**
 * Remove experience to the user
 * @param {any} message Parameter of your event message
 * @param {string} userID ID of the user
 * @param {number} XP The experience that will be removed
 * @returns {any}
 */
export declare function removeXP(message: any, userID: string, XP: number): any;
/**
 * Allows you to obtain a user's information
 * @param {any} message Parameter of your event message
 * @param {string} userID ID of the user
 * @returns {any}
 */
export declare function fetch(message: any, userID: string): any;
/**
 * Returns a ranking of the experience in the server
 * @param {any} client Discord.js Client
 * @param {any} message Parameter of your event message
 * @returns {any}
 */
export declare function leaderboard(client: any, message: any): any;
/**
 * Returns a rankcard
 * @param {any} message Parameter of your event message
 * @param {string} userID The ID of the user
 * @returns {any}
 */
export declare function Rankcard(message: any, userID: string): any;
