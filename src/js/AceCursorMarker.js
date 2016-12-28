export default class AceCursorMarker {

  constructor(session, cursorId, title, color, position) {
    this._session = session;
    this._title = title;
    this._color = color;
    this._position = position ? this._convertPosition(position) : null;
    this._cursorId = cursorId;
    this._id = null;
  }

  update(html, markerLayer, session, layerConfig) {
    if (this._position === null) {
      return;
    }

    const screenPosition = this._session.documentToScreenPosition(
      this._position.row, this._position.column);

    const top = markerLayer.$getTop(screenPosition.row, layerConfig);
    const left = markerLayer.$padding + screenPosition.column * layerConfig.characterWidth;
    const height = layerConfig.lineHeight;

    html.push(
      '<div class="ace-multi-cursor ace_start" style="',
      `height: ${height - 3}px;`,
      `width: ${2}px;`,
      `top: ${top + 2}px;`,
      `left: ${left}px;`,
      `background-color: ${this._color};`,
      '"></div>'
    );

    // Caret Top
    html.push(
      '<div class="ace-multi-cursor ace_start" style="',
      `height: ${5}px;`,
      `width: ${6}px;`,
      `top: ${top - 2}px;`,
      `left: ${left - 2}px;`,
      `background-color: ${this._color};`,
      '"></div>'
    );
  }

  setPosition(position) {
    this._position = this._convertPosition(position);
    this._forceSessionUpdate();
  };

  setVisible(visible) {
    const old = this._visible;

    this._visible = visible;
    if (old !== this._visible) {
      this._forceSessionUpdate();
    }
  };

  isVisible() {
    return this._visible;
  }

  cursorId() {
    return this._cursorId;
  }

  markerId() {
    return this._id;
  }

  _forceSessionUpdate() {
    this._session._signal('changeFrontMarker');
  }

  _convertPosition(position) {
    const type = typeof position;

    if (position === null) {
      return null;
    } else if (type === 'number') {
      return this._session.getDocument().indexToPosition(position, 0);
    } else if (typeof position.row === 'number' && typeof position.column === 'number') {
      return position;
    }

    throw new Error(`Invalid position: ${position}`);
  }
}
