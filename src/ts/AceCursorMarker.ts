import * as ace from "brace";

/**
 * Represents a marker of a remote users cursor.
 */
export class AceCursorMarker {
  private _session: ace.IEditSession;
  private _label: string;
  private _color: string;
  private _position: ace.Position;
  private _cursorId: string;
  private _id: string;
  private _visible: boolean;

  /**
   * Constructs a new AceCursorMarker
   * @param session The Ace Editor Session to bind to.
   * @param cursorId the unique id of this cursor.
   * @param label The label to display over the cursor.
   * @param color The css color of the cursor
   * @param position The row / column coordinate of the cursor marker.
   */
  constructor(session: ace.IEditSession, cursorId: string, label: string, color: string, position: ace.Position) {
    this._session = session;
    this._label = label;
    this._color = color;
    this._position = position ? this._convertPosition(position) : null;
    this._cursorId = cursorId;
    this._id = null;
    this._visible = false;
  }

  /**
   * Called by Ace to update the rendering of the marker.
   *
   * @param html The html to render, represented by an array of strings.
   * @param markerLayer The marker layer containing the cursor marker.
   * @param _ Not used.
   * @param layerConfig
   */
  public update(html: string[], markerLayer: any, _: ace.IEditSession, layerConfig: any): void {
    if (this._position === null) {
      return;
    }

    const screenPosition = this._session.documentToScreenPosition(
      this._position.row, this._position.column);

    const top: number = markerLayer.$getTop(screenPosition.row, layerConfig);
    const left: number = markerLayer.$padding + screenPosition.column * layerConfig.characterWidth;
    const height: number = layerConfig.lineHeight;

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

  /**
   * Sets the location of the cursor marker.
   * @param position The row / column coordinate of the cursor marker.
   */
  public setPosition(position: ace.Position): void {
    this._position = this._convertPosition(position);
    this._forceSessionUpdate();
  }

  /**
   * Sets the marker to visible / invisible.
   *
   * @param visible true if the marker should be displayed, false otherwise.
   */
  public setVisible(visible: boolean): void {
    const old = this._visible;

    this._visible = visible;
    if (old !== this._visible) {
      this._forceSessionUpdate();
    }
  }

  /**
   * Determines if the marker should be visible.
   *
   * @returns true if the cursor should be visible, false otherwise.
   */
  public isVisible(): boolean {
    return this._visible;
  }

  /**
   * Gets the unique id of this cursor.
   * @returns the unique id of this cursor.
   */
  public cursorId(): string {
    return this._cursorId;
  }

  /**
   * Gets the id of the marker.
   * @returns The marker id.
   */
  public markerId(): string {
    return this._id;
  }

  /**
   * Gets the label of the marker.
   * @returns The marker's label.
   */
  public getLabel(): string {
    return this._label;
  }

  private _forceSessionUpdate(): void {
    (this._session as any)._signal('changeFrontMarker');
  }

  private _convertPosition(position: any): ace.Position {
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
