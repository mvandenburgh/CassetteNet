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
export class ChangeMixtapeName_Transaction extends jsTPS_Transaction {
    /**
     * Constructor for this transaction, it initializes this
     * object with all the data needed to both do and undo
     * the transaction.
     * 
     * @param oldName
     * @param newName
     * @param mixtape
     */
    constructor(oldName, newName, mixtape) {
        super();

        this.oldName = oldName;
        this.newName = newName;
        this.mixtape = mixtape;
    }

    /**
     * A transaction to change a mixtape's name.
     */
    doTransaction() {
        this.oldName = this.mixtape.name;
        this.mixtape.name = this.newName;
        console.log(this.oldName + " -> " + this.mixtape.name);
    }

    /**
     * Undo the name change.
     */
    undoTransaction() {
        this.mixtape.name = this.oldName;
        console.log(this.newName + " -> " + this.mixtape.name);
    }

    /**
     * Provides a textual summary of this transaction.
     * 
     * @return A string storing a textual summary of this object.
     */
    toString() {
        return "Old Name: " + this.oldName + ", New Name: " + this.newName;
    }
}
