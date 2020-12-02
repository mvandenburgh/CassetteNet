import {jsTPS_Transaction} from "../../utils/jsTPS.js"

/**
 * SongPosition_Transaction.js
 * 
 * This class is a transaction that can be executed and undone. It
 * can be stored in the jsTPS transaction stack and must be constructed
 * with all the data necessary to perform both do and undo.
 * 
 * 
 */
export class SongPosition_Transaction extends jsTPS_Transaction {
    /**
     * Constructor for this transaction, it initializes this
     * object with all the data needed to both do and undo
     * the transaction.
     * 
     * @param initPosition
     * @param initNewPosition
     */
    constructor(initPosition, initNewPosition, songOrder, mixtape) {
        super();

        // OLD POSITION
        this.position = initPosition;
        this.oldPosition = initPosition;

        // THE SONG'S NEW POSITION
        this.newPosition = initNewPosition;

        this.songOrder = songOrder;
        this.mixtape = mixtape;

        this.transactionType = 'SongPosition_Transaction';
    }

    /**
     * This transaction simply changes the song's position.
     */
    doTransaction() {

        this.oldPosition = this.position;
        this.position = this.newPosition;
        const [removed] = this.songOrder.splice(this.oldPosition, 1);
        this.songOrder.splice(this.position, 0, removed);
        this.mixtape.songs = this.songOrder;
        console.log(this.oldPosition + " -> " + this.position);
    }

    /**
     * As the reverse of do, this method substracts from num. This is necessary unlike doTransaction.
     */
    undoTransaction() {
        const [removed] = this.songOrder.splice(this.newPosition, 1);
        this.songOrder.splice(this.oldPosition, 0, removed);
        this.mixtape.songs = this.songOrder;
        this.position = this.oldPosition;
        console.log(this.newPosition + " -> " + this.position);
        //this.position = this.oldPosition;
    }

    /**
     * Provides a textual summary of this transaction.
     * 
     * @return A string storing a textual summary of this object.
     */
    toString() {
        return "Old Position: " + this.oldPosition + ", New Position: " + this.position;
    }
}
