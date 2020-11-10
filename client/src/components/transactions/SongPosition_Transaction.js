import {jsTPS_Transaction} from "../../utils/jsTPS.js"

/**
 * SongPosition_Transaction.js
 * 
 * This class is a transaction that can be executed and undone. It
 * can be stored in the jsTPS transaction stack and must be constructed
 * with all the data necessary to perform both do and undo.
 * 
 * @author THE McKilla Gorilla (accept no imposters)
 * @version 1.0
 */
export class SongPosiiton_Transaction extends jsTPS_Transaction {
    /**
     * Constructor for this transaction, it initializes this
     * object with all the data needed to both do and undo
     * the transaction.
     * 
     * @param initPosition
     * @param initNewPosition
     */
    constructor(initPosition, initNewPosition) {
        super();

        // OLD POSITION
        this.position = initPosition;
        this.oldPosition = initPosition;

        // THE SONG'S NEW POSITION
        this.newPosition = initNewPosition
    }

    /**
     * This transaction simply changes the song's position.
     */
    doTransaction() {
        //let oldPosition = this.position;
        //let newPosition = oldPosition + this.amountToAdd;
        this.oldPosition = this.position;
        this.position = this.newPosition;
    }

    /**
     * As the reverse of do, this method substracts from num.
     */
    undoTransaction() {
        // let oldNum = this.num.getNum();
        // let newNum = oldNum - this.amountToAdd;
        this.position = this.oldPosition;
    }

    /**
     * Provides a textual summary of this transaction.
     * 
     * @return A string storing a textual summary of this object.
     */
    toString() {
        return "Old Position: " + this.position + ", New Position: " + this.newPosition;
    }
}