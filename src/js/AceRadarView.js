import AceRadarViewIndicator from './AceRadarViewIndicator';

export default class AceRadarView {
  constructor(element, editor) {
    this._container = null;
    if (typeof element === 'string') {
      this._container = document.getElementById(element);
    } else {
      this._container = element;
    }

    this._container.style.position = 'relative';
    this._views = [];
    this._editor = editor;
  };

  addView(id, label, color, viewRows, cursorRow) {
    const indicator = new AceRadarViewIndicator(
      id,
      label,
      color,
      viewRows,
      cursorRow,
      this._editor
    );

    this._container.appendChild(indicator.element());
    indicator.update();

    this._views[id] = indicator;
  }

  hasView(id) {
    return this._views[id] !== undefined;
  }

  /**
   *
   * @param id
   * @param rows {start: 0, end: 34}
   */
  setViewRows(id, rows) {
    const indicator = this._views[id];

    indicator.setViewRows(rows);
  }

  setCursorRow(id, row) {
    const indicator = this._views[id];

    indicator.setCursorRow(row);
  }

  clearView(id) {
    // fixme implement
  }

  removeView(id) {
    const indicator = this._views[id];

    indicator.dispose();
    delete this._views[id];
  }
}
