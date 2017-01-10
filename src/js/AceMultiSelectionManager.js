import AceSelectionMarker from './AceSelectionMarker';

/**
 * Implements multiple colored selections in the ace editor.  Each selection is
 * associated with a particular user. Each user is identified by a unique id
 * and has a color associated with them.  The selection manager supports block
 * selection through multiple AceRanges.
 */
export default class AceMultiSelectionManager {

  /**
   * Constructs a new AceMultiSelectionManager that is bound to a particular
   * Ace EditSession instance.
   *
   * @param session {EditSession}
   *   The Ace EditSession to bind to.
   */
  constructor(session) {
    this._selections = {};
    this._session = session;
  }

  /**
   * Adds a new collaborative selection.
   *
   * @param id {string}
   *   The unique system identifier for the user associated with this selection.
   * @param label {string}
   *   A human readable / meaningful label / title that identifies the user.
   * @param color {string}
   *   A valid css color string.
   * @param ranges {Array<AceRange>}
   *   An array of ace ranges that specify the initial selection.
   */
  addSelection(id, label, color, ranges) {
    if (this._selections[id] !== undefined) {
      throw new Error('Selection with id already defined: ' + id);
    }

    const marker = new AceSelectionMarker(this._session, id, label, color, ranges);

    this._selections[id] = marker;
    this._session.addDynamicMarker(marker, false);
  }

  /**
   * Updates the selection for a particular user.
   *
   * @param id {string}
   *   The unique identifier for the user.
   * @param ranges {Array<AceRange>}
   *   The array of ranges that specify the selection.
   */
  setSelection(id, ranges) {
    const selection = this._getSelection(id);

    selection.setSelection(ranges);
  }

  /**
   * Clears the selection (but does not remove it) for the specified user.
   * @param id {string}
   *   The unique identifier for the user.
   */
  clearSelection(id) {
    const selection = this._getSelection(id);

    selection.setSelection(null);
  }

  /**
   * Removes the selection for the specified user.
   * @param id {string}
   *   The unique identifier for the user.
   */
  removeSelection(id) {
    const selection = this._selections[id];

    if (selection === undefined) {
      throw new Error('Selection not found: ' + id);
    }
    this._session.removeMarker(selection.id);
    delete this._selections[id];
  }

  /**
   * Removes all selections.
   */
  removeAll() {
    Object.getOwnPropertyNames(this._selections).forEach((key) => {
      this.removeSelection(this._selections[key].selectionId());
    });
  }

  _getSelection(id) {
    const selection = this._selections[id];

    if (selection === undefined) {
      throw new Error('Selection not found: ' + id);
    }
    return selection;
  }
}
