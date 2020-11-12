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
export class AddSong_Transaction extends jsTPS_Transaction {
    /**
     * Constructor for this transaction, it initializes this
     * object with all the data needed to both do and undo
     * the transaction.
     * 
     * @param oldSongs
     * @param newSong
     * @param mixtape
     */
    constructor(oldSongs, newSongs, mixtape) {
        super();

        this.oldSongs = oldSongs;
        this.newSongs = newSongs;
        this.mixtape = mixtape;
    }

    /**
     * 
     */
    doTransaction() {
        //console.log(this.oldPosition + " -> " + this.position);
        this.mixtape.songs = this.newSongs;
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
