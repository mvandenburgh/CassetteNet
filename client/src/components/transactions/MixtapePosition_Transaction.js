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
export class MixtapePosition_Transaction extends jsTPS_Transaction {
    /**
     * Constructor for this transaction, it initializes this
     * object with all the data needed to both do and undo
     * the transaction.
     * 
     * @param initPosition
     * @param initNewPosition
     */
    constructor(initPosition, initNewPosition, mixtape, mixtapeList) {
        super();

        // OLD POSITION
        this.position = initPosition;
        this.oldPosition = initPosition;

        // THE SONG'S NEW POSITION
        this.newPosition = initNewPosition;
        this.mixtapeList = mixtapeList;

        this.mixtape = mixtape;
    }

    /**
     * This transaction simply changes the song's position.
     */
    doTransaction() {
        //let oldPosition = this.position;
        //let newPosition = oldPosition + this.amountToAdd;
        this.oldPosition = this.position;
        this.position = this.newPosition;
        console.log(this.oldPosition + " -> " + this.position);
    }

    /**
     * As the reverse of do, this method substracts from num. This is necessary unlike doTransaction.
     */
    undoTransaction() {
        const [removed] = this.mixtapeList.splice(this.newPosition, 1);
        this.mixtapeList.splice(this.oldPosition, 0, removed);
        this.position = this.oldPosition;
        console.log(this.newPosition + " -> " + this.position);
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
