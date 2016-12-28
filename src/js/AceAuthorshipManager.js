import AceAuthorshipMarker from './AceAuthorshipMarker';
import {default as ace} from 'ace';

var AceRange = ace.require('ace/range').Range;

export default class AceAuthorshipManager {

  constructor(editor) {
    this._authors = {};
    this._session = editor.getSession();
  }

  addSelection(id, label, color, ranges) {
    if (this._authors[id] !== undefined) {
      throw new Error('Selection with id already defined: ' + id);
    }

    const marker = new AceAuthorshipMarker(this._session, id, label, color);

    this._authors[id] = marker;
    this._session.addDynamicMarker(marker, false);
  }

  handleInsert(id, range) {
    const author = this._getSelection(id);
    author.handleInsert(range);
  }

  clearAuthor(id) {
    const selection = this._getSelection(id);

    selection.setRange(null);
  }

  removeAuthor(id) {
    const author = this._getAuthor(id);
    this._session.removeMarker(author.id);
    delete this._authors[id];
  }

  removeAll() {
    Object.getOwnPropertyNames(this._authors).forEach((key) => {
      this.removeSelection(key);
    });
  }

  _getAuthor(id) {
    const author = this._authors[id];

    if (author === undefined) {
      throw new Error('Author not found: ' + id);
    }
    return author;
  }

  _toAceRange(value) {
    if (value === null || value === undefined) {
      return null;
    }

    let start = value.start;
    let end = value.end;

    if (start > end) {
      let temp = start;

      start = end;
      end = temp;
    }

    const selectionAnchor = this._session.getDocument().indexToPosition(start);
    const selectionLead = this._session.getDocument().indexToPosition(end);

    return new AceRange(selectionAnchor.row, selectionAnchor.column, selectionLead.row, selectionLead.column);
  }
}
