import AceCursorMarker from './AceCursorMarker';

/**
 * Implements multiple colored cursors in the ace editor.  Each cursor is
 * associated with a particular user. Each user is identified by a unique id
 * and has a color associated with them.  Each cursor has a position in the
 * editor which is specified by a 2-d row and column ({row: 0, column: 10}).
 */
export default class AceMultiCursorManager {

  /**
   * Constructs a new AceMultiCursorManager that is bound to a particular
   * Ace EditSession instance.
   *
   * @param session {EditSession}
   *   The Ace EditSession to bind to.
   */
  constructor(session) {
    this._cursors = {};
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
   * @param position {*}
   *   A 2D-position indicating the location of the cusror in row column format e.g. {row: 0, column: 10}
   */
  addCursor(id, label, color, position) {
    if (this._cursors[id] !== undefined) {
      throw new Error(`Cursor with id already defined: ${id}`);
    }

    const marker = new AceCursorMarker(this._session, id, label, color, position);

    this._cursors[id] = marker;
    this._session.addDynamicMarker(marker, true);
  }

  /**
   * Updates the selection for a particular user.
   *
   * @param id {string}
   *   The unique identifier for the user.
   * @param position {*}
   *   A 2-d position indicating the location of the cusror in row column format e.g. {row: 0, column: 10}
   */
  setCursor(id, position) {
    const cursor = this._getCursor(id);

    cursor.setPosition(position);
  }

  /**
   * Clears the cursor (but does not remove it) for the specified user.
   *
   * @param id {string}
   *   The unique identifier for the user.
   */
  clearCursor(id) {
    const cursor = this._getCursor(id);

    cursor.setPosition(null);
  }

  /**
   * Removes the cursor for the specified user.
   *
   * @param id {string}
   *   The unique identifier for the user.
   */
  removeCursor(id) {
    const cursor = this._cursors[id];

    if (cursor === undefined) {
      throw new Error(`Cursor not found: ${id}`);
    }
    this._session.removeMarker(cursor.id);
    delete this._cursors[id];
  }

  /**
   * Removes all cursors.
   */
  removeAll() {
    Object.getOwnPropertyNames(this._cursors).forEach((key) => {
      this.removeCursor(this._cursors[key].cursorId());
    });
  }

  _getCursor(id) {
    const cursor = this._cursors[id];

    if (cursor === undefined) {
      throw new Error(`Cursor not found: ${id}`);
    }
    return cursor;
  }
}
