export default class AceSelectionMarker {
  constructor(session, selectionId, title, color, range) {
    this._session = session;
    this._title = title;
    this._color = color;
    this._range = range || [];
    this._selectionId = selectionId;
    this._id = null;
  }

  update(html, markerLayer, session, layerConfig) {
    this._range.forEach((range) => {
      this._renderRange(html, markerLayer, session, layerConfig, range);
    });
  }

  _renderChar(html, markerLayer, session, layerConfig, range) {
    const screenRange = range.toScreenRange(session);

    let height = layerConfig.lineHeight;
    let top = markerLayer.$getTop(screenRange.start.row, layerConfig);
    let left = markerLayer.$padding + screenRange.start.column * layerConfig.characterWidth;
    let width = 0;

    if (screenRange.isMultiLine()) {
      // Render the start line
      this._renderLine(html, {height: height, right: 0, top: top, left: left});

      // from start of the last line to the selection end
      top = markerLayer.$getTop(range.end.row, layerConfig);
      width = screenRange.end.column * layerConfig.characterWidth;
      this._renderLine(html, {height: height, width: width, top: top, left: markerLayer.$padding});

      // all the complete lines
      height = (range.end.row - range.start.row - 1) * layerConfig.lineHeight;
      if (height < 0) {
        return;
      }
      top = markerLayer.$getTop(range.start.row + 1, layerConfig);
      this._renderLine(html, {height: height, right: 0, top: top, left: markerLayer.$padding});
    } else {
      width = (range.end.column - range.start.column) * layerConfig.characterWidth;
      this._renderLine(html, {height: height, width: width, top: top, left: left});
    }
  }

  _renderLine(html, bounds) {
    html.push('<div class="ace-multi-selection" style="');

    if (typeof bounds.height === 'number') {
      html.push(` height: ${bounds.height}px;`);
    }

    if (typeof bounds.width === 'number') {
      html.push(` width: ${bounds.width}px;`);
    }

    if (typeof bounds.top === 'number') {
      html.push(` top: ${bounds.top}px;`);
    }

    if (typeof bounds.left === 'number') {
      html.push(` left: ${bounds.left}px;`);
    }

    if (typeof bounds.bottom === 'number') {
      html.push(` bottom: ${bounds.bottom}px;`);
    }

    if (typeof bounds.right === 'number') {
      html.push(` right: ${bounds.right}px;`);
    }

    html.push(`background-color: ${this._color}">`);
    html.push('</div>');
  }

  setRange(range) {
    if (range instanceof Array) {
      this._range = range;
    } else {
      this._range = [range];
    }

    this._forceSessionUpdate();
  }

  selectionId() {
    return this._selectionId;
  }

  markerId() {
    return this._id;
  }

  _forceSessionUpdate() {
    this._session._signal('changeBackMarker');
  }
}

export default class AceCharacterAuthorMarker {
  constructor(session, selectionId, title, color, range) {
    this._session = session;
    this._title = title;
    this._color = color;
    this._range = range || [];
    this._selectionId = selectionId;
    this._id = null;
  }
}
