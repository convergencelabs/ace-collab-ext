import AceSelectionMarker from './AceSelectionMarker';

export default class AceMultiSelectionManager {

  constructor(editor) {
    this._selections = {};
    this._session = editor.getSession();
  }

  addSelection(id, label, color, ranges) {
    if (this._selections[id] !== undefined) {
      throw new Error('Selection with id already defined: ' + id);
    }

    const marker = new AceSelectionMarker(this._session, id, label, color, ranges);

    this._selections[id] = marker;
    this._session.addDynamicMarker(marker, false);
  }

  setSelection(id, ranges) {
    const selection = this._getSelection(id);

    selection.setSelection(ranges);
  }

  clearSelection(id) {
    const selection = this._getSelection(id);

    selection.setSelection(null);
  }

  removeSelection(id) {
    const selection = this._selections[id];

    if (selection === undefined) {
      throw new Error('Selection not found: ' + id);
    }
    this._session.removeMarker(selection.id);
    delete this._selections[id];
  }

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
