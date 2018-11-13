import * as ace from "brace";

export interface ISelectionBounds {
  height?: number;
  width?: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

export class AceSelectionMarker {

  private _session: ace.IEditSession;
  private _label: string;
  private _color: string;
  private _ranges: ace.Range[];
  private _selectionId: string;
  private _id: string;

  constructor(session: ace.IEditSession, selectionId: string, label: string, color: string, ranges: ace.Range[]) {
    this._session = session;
    this._label = label;
    this._color = color;
    this._ranges = ranges || [];
    this._selectionId = selectionId;
    this._id = null;
  }

  public update(html: string[], markerLayer: any, session: ace.IEditSession, layerConfig: any): void {
    this._ranges.forEach((range) => {
      this._renderRange(html, markerLayer, session, layerConfig, range);
    });
  }

  public setSelection(ranges: ace.Range[]): void {
    if (ranges === undefined || ranges === null) {
      this._ranges = [];
    } else if (ranges instanceof Array) {
      this._ranges = ranges;
    } else {
      this._ranges = [ranges];
    }

    this._forceSessionUpdate();
  }

  public selectionId(): string {
    return this._selectionId;
  }

  public markerId(): string {
    return this._id;
  }
  private _renderRange(
    html: string[], markerLayer: any, session: ace.IEditSession, layerConfig: any, range: ace.Range): void {
    const screenRange: ace.Range = range.toScreenRange(session);

    let height: number = layerConfig.lineHeight;
    let top: number = markerLayer.$getTop(screenRange.start.row, layerConfig);
    let width: number = 0;
    const right = 0;
    const left: number = markerLayer.$padding + screenRange.start.column * layerConfig.characterWidth;

    if (screenRange.isMultiLine()) {
      // Render the start line
      this._renderLine(html, {height, right, top, left});

      // from start of the last line to the selection end
      top = markerLayer.$getTop(screenRange.end.row, layerConfig);
      width = screenRange.end.column * layerConfig.characterWidth;
      this._renderLine(html, {height, width, top, left: markerLayer.$padding});

      // all the complete lines
      height = (screenRange.end.row - screenRange.start.row - 1) * layerConfig.lineHeight;
      if (height < 0) {
        return;
      }
      top = markerLayer.$getTop(screenRange.start.row + 1, layerConfig);
      this._renderLine(html, {height, right, top, left: markerLayer.$padding});
    } else {
      width = (range.end.column - range.start.column) * layerConfig.characterWidth;
      this._renderLine(html, {height, width, top, left});
    }
  }

  private _renderLine(html: string[], bounds: ISelectionBounds): void {
    html.push(`<div title="${this._label}" class="ace-multi-selection" style="`);

    if (typeof bounds.height === "number") {
      html.push(` height: ${bounds.height}px;`);
    }

    if (typeof bounds.width === "number") {
      html.push(` width: ${bounds.width}px;`);
    }

    if (typeof bounds.top === "number") {
      html.push(` top: ${bounds.top}px;`);
    }

    if (typeof bounds.left === "number") {
      html.push(` left: ${bounds.left}px;`);
    }

    if (typeof bounds.bottom === "number") {
      html.push(` bottom: ${bounds.bottom}px;`);
    }

    if (typeof bounds.right === "number") {
      html.push(` right: ${bounds.right}px;`);
    }

    html.push(`background-color: ${this._color}">`);
    html.push("</div>");
  }

  private _forceSessionUpdate(): void {
    (this._session as any)._signal("changeBackMarker");
  }
}
