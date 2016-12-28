import AceCursorMarker from './AceCursorMarker';

export default class AceMultiCursorManager {

  constructor(editor) {
    this._cursors = {};
    this._session = editor.getSession();
  }

  addCursor(id, title, color, position) {
    if (this._cursors[id] !== undefined) {
      throw new Error(`Cursor with id already defined: ${id}`);
    }

    const marker = new AceCursorMarker(this._session, id, title, color, position);

    this._cursors[id] = marker;
    this._session.addDynamicMarker(marker, true);
  }

  setCursor(id, position) {
    const cursor = this._getCursor(id);

    cursor.setPosition(position);
  }

  clearCursor(id) {
    const cursor = this._getCursor(id);

    cursor.setPosition(null);
  }

  removeCursor(id) {
    const cursor = this._cursors[id];

    if (cursor === undefined) {
      throw new Error(`Cursor not found: ${id}`);
    }
    this._session.removeMarker(cursor.id);
    delete this._cursors[id];
  }

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
