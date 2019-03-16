import {Ace} from "ace-builds";

export interface ISelectionBounds {
  height?: number;
  width?: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

export class AceSelectionMarker implements Ace.MarkerLike {
  public range: Ace.Range;
  public type: string;
  public renderer?: Ace.MarkerRenderer;
  public clazz: string;
  public inFront: boolean;
  public id: number;

  private _session: Ace.EditSession;
  private readonly _label: string;
  private readonly _color: string;
  private _ranges: Ace.Range[];
  private readonly _selectionId: string;
  private readonly _id: string;
  private readonly _markerElement: HTMLDivElement;

  constructor(session: Ace.EditSession, selectionId: string, label: string, color: string, ranges: Ace.Range[]) {
    this._session = session;
    this._label = label;
    this._color = color;
    this._ranges = ranges || [];
    this._selectionId = selectionId;
    this._id = null;
    this._markerElement = document.createElement("div");
  }

  public update(_: string[], markerLayer: any, session: Ace.EditSession, layerConfig: any): void {
    while (this._markerElement.hasChildNodes()) {
      this._markerElement.removeChild(this._markerElement.lastChild);
    }

    this._ranges.forEach((range) => {
      this._renderRange(markerLayer, session, layerConfig, range);
    });

    this._markerElement.remove();
    markerLayer.elt("remote-selection", "");
    const parentNode = markerLayer.element.childNodes[markerLayer.i - 1] || markerLayer.element.lastChild;
    parentNode.appendChild(this._markerElement);
  }

  public setSelection(ranges: Ace.Range[]): void {
    if (ranges === undefined || ranges === null) {
      this._ranges = [];
    } else if (ranges instanceof Array) {
      this._ranges = ranges;
    } else {
      this._ranges = [ranges];
    }

    this._forceSessionUpdate();
  }

  public getLabel(): string {
    return this._label;
  }

  public selectionId(): string {
    return this._selectionId;
  }

  public markerId(): string {
    return this._id;
  }

  private _renderLine(bounds: ISelectionBounds): void {
    const div = document.createElement("div");
    div.className = "ace-multi-selection";
    div.style.backgroundColor = this._color;

    if (typeof bounds.height === "number") {
      div.style.height = `${bounds.height}px`;
    }

    if (typeof bounds.width === "number") {
      div.style.width = `${bounds.width}px`;
    }

    if (typeof bounds.top === "number") {
      div.style.top = `${bounds.top}px`;
    }

    if (typeof bounds.left === "number") {
      div.style.left = `${bounds.left}px`;
    }

    if (typeof bounds.bottom === "number") {
      div.style.bottom = `${bounds.bottom}px`;
    }

    if (typeof bounds.right === "number") {
      div.style.right = `${bounds.right}px`;
    }

    this._markerElement.append(div);
  }

  private _renderRange(markerLayer: any, session: Ace.EditSession, layerConfig: any, range: Ace.Range): void {
    const screenRange: Ace.Range = range.toScreenRange(session);

    let height: number = layerConfig.lineHeight;
    let top: number = markerLayer.$getTop(screenRange.start.row, layerConfig);
    let width: number = 0;
    const right = 0;
    const left: number = markerLayer.$padding + screenRange.start.column * layerConfig.characterWidth;

    if (screenRange.isMultiLine()) {
      // Render the start line
      this._renderLine({height, right, top, left});

      // from start of the last line to the selection end
      top = markerLayer.$getTop(screenRange.end.row, layerConfig);
      width = screenRange.end.column * layerConfig.characterWidth;
      this._renderLine({height, width, top, left: markerLayer.$padding});

      // all the complete lines
      height = (screenRange.end.row - screenRange.start.row - 1) * layerConfig.lineHeight;
      if (height < 0) {
        return;
      }
      top = markerLayer.$getTop(screenRange.start.row + 1, layerConfig);
      this._renderLine({height, right, top, left: markerLayer.$padding});
    } else {
      width = (range.end.column - range.start.column) * layerConfig.characterWidth;
      this._renderLine({height, width, top, left});
    }
  }

  private _forceSessionUpdate(): void {
    (this._session as any)._signal("changeBackMarker");
  }
}
