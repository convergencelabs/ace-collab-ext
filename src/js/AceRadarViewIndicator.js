export default class AceRadarViewIndicator {
  constructor(id, label, color, viewRows, cursorRow, editor) {
    this._id = id;
    this._label = label;
    this._color = color;
    this._viewRows = viewRows;
    this._cursorRow = cursorRow;
    this._editor = editor;
    this._docLineCount = editor.getSession().getLength();

    this._editorListener = () => {
      const newLineCount = this._editor.getSession().getLength();

      if (newLineCount !== this._docLineCount) {
        this._docLineCount = newLineCount;
        this.update();
      }
    };
    this._editor.on('change', this._editorListener);

    this._scrollElement = document.createElement('div');
    this._scrollElement.className = 'ace-radar-view-scroll-indicator';

    this._scrollElement.style.borderColor = this._color;
    this._scrollElement.style.background = this._color;

    // todo implement a custom tooltip for consistent presentation.
    this._scrollElement.title = this._label;

    this._scrollElement.addEventListener('click', (e) => {
      const middle = ((this._viewRows.end - this._viewRows.start) / 2) + this._viewRows.start;

      this._editor.scrollToLine(middle, true, false);
    }, false);

    this._cursorElement = document.createElement('div');
    this._cursorElement.className = 'ace-radar-view-cursor-indicator';
    this._cursorElement.style.background = this._color;
    this._cursorElement.title = this._label;

    this._cursorElement.addEventListener('click', (e) => {
      this._editor.scrollToLine(this._cursorRow, true, false);
    }, false);

    this._wrapper = document.createElement('div');
    this._wrapper.className = 'ace-radar-view-wrapper';
    this._wrapper.style.display = 'none';

    this._wrapper.appendChild(this._scrollElement);
    this._wrapper.appendChild(this._cursorElement);
  }

  element() {
    return this._wrapper;
  }

  setCursorRow(cursorRow) {
    this._cursorRow = cursorRow;
    this.update();
  }

  setViewRows(viewRows) {
    this._viewRows = viewRows;
    this.update();
  }

  update() {
    if (!this._isSet(this._viewRows) && !this._isSet(this._cursorRow)) {
      this._wrapper.style.display = 'none';
    } else {
      this._wrapper.style.display = null;
      const maxLine = this._docLineCount - 1;

      if (!this._isSet(this._viewRows)) {
        this._scrollElement.style.display = 'none';
      } else {
        const topPercent = Math.min(maxLine, this._viewRows.start) / maxLine * 100;
        const bottomPercent = 100 - (Math.min(maxLine, this._viewRows.end) / maxLine * 100);

        this._scrollElement.style.top = topPercent + '%';
        this._scrollElement.style.bottom = bottomPercent + '%';
        this._scrollElement.style.display = null;
      }

      if (!this._isSet(this._cursorRow)) {
        this._cursorElement.style.display = 'none';
      } else {
        const cursorPercent = Math.min(this._cursorRow, maxLine) / maxLine;
        const ratio = (this._wrapper.offsetHeight - this._cursorElement.offsetHeight) / this._wrapper.offsetHeight;
        const cursorTop = cursorPercent * ratio * 100;

        this._cursorElement.style.top = cursorTop + '%';
        this._cursorElement.style.display = null;
      }
    }
  }

  _isSet(value) {
    return value !== undefined && value !== null;
  }

  dispose() {
    this._wrapper.parentNode.removeChild(this._wrapper);
    this._editor.off(this._editorListener);
  }
}
