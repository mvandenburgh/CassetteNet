import {jsTPS_Transaction} from "../../utils/jsTPS.js"

/**
 * DeleteSong_Transaction.js
 * 
 * This class is a transaction that can be executed and undone. It
 * can be stored in the jsTPS transaction stack and must be constructed
 * with all the data necessary to perform both do and undo.
 * 
 * 
 */
export class DeleteSong_Transaction extends jsTPS_Transaction {
    /**
     * Constructor for this transaction, it initializes this
     * object with all the data needed to both do and undo
     * the transaction.
     * 
     * @param oldSongs
     * @param newSongs
     * @param mixtape
     */
    constructor(oldSongs, songsToDelete, mixtape) {
        super();

        this.oldSongs = oldSongs;
        this.songsToDelete = songsToDelete;
        this.mixtape = mixtape;
    }

    /**
     * 
     */
    doTransaction() {
        const newSongs = this.mixtape.songs.filter(song => !this.songsToDelete.includes(song.id));
        this.oldSongs = this.mixtape.songs
        this.mixtape.songs = newSongs;
    }

    /**
     * 
     */
    undoTransaction() {
        this.mixtape.songs = this.oldSongs;
    }

    /**
     * Provides a textual summary of this transaction.
     * 
     * @return A string storing a textual summary of this object.
     */
    toString() {
        return "";
    }
}
