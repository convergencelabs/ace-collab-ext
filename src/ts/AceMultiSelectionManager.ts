import * as ace from "brace";
import { AceSelectionMarker } from './AceSelectionMarker';

/**
 * Implements multiple colored selections in the ace editor.  Each selection is
 * associated with a particular user. Each user is identified by a unique id
 * and has a color associated with them.  The selection manager supports block
 * selection through multiple AceRanges.
 */
export class AceMultiSelectionManager {

  private _selections: {[key: string]: AceSelectionMarker};
  private _session: ace.IEditSession;

  /**
   * Constructs a new AceMultiSelectionManager that is bound to a particular
   * Ace EditSession instance.
   *
   * @param session
   *   The Ace EditSession to bind to.
   */
  constructor(session: ace.IEditSession) {
    this._selections = {};
    this._session = session;
  }

  /**
   * Adds a new collaborative selection.
   *
   * @param id
   *   The unique system identifier for the user associated with this selection.
   * @param label
   *   A human readable / meaningful label / title that identifies the user.
   * @param color
   *   A valid css color string.
   * @param ranges
   *   An array of ace ranges that specify the initial selection.
   */
  public addSelection(id: string, label: string, color: string, ranges: ace.Range[]): void {
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
   * @param id
   *   The unique identifier for the user.
   * @param ranges
   *   The array of ranges that specify the selection.
   */
  public setSelection(id: string, ranges: ace.Range[]) {
    const selection = this._getSelection(id);

    selection.setSelection(ranges);
  }

  /**
   * Clears the selection (but does not remove it) for the specified user.
   * @param id
   *   The unique identifier for the user.
   */
  public clearSelection(id: string): void {
    const selection = this._getSelection(id);

    selection.setSelection(null);
  }

  /**
   * Removes the selection for the specified user.
   * @param id
   *   The unique identifier for the user.
   */
  public removeSelection(id: string) {
    const selection = this._selections[id];

    if (selection === undefined) {
      throw new Error('Selection not found: ' + id);
    }

    // note: ace adds the id property to whatever marker you pass in.
    this._session.removeMarker((selection as any).id);
    delete this._selections[id];
  }

  /**
   * Removes all selections.
   */
  public removeAll(): void {
    Object.getOwnPropertyNames(this._selections).forEach((key) => {
      this.removeSelection(this._selections[key].selectionId());
    });
  }

  private _getSelection(id: string): AceSelectionMarker {
    const selection: AceSelectionMarker = this._selections[id];

    if (selection === undefined) {
      throw new Error('Selection not found: ' + id);
    }
    return selection;
  }
}
