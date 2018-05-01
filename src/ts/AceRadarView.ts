import * as ace from "brace";
import { AceRadarViewIndicator } from './AceRadarViewIndicator';
import {RowRange} from "./RowRange";

export class AceRadarView {
  private _container: HTMLElement;
  private _views: {[key: string]: AceRadarViewIndicator};
  private _editor: ace.Editor;
  constructor(element: HTMLElement | string, editor: ace.Editor) {
    this._container = null;
    if (typeof element === 'string') {
      this._container = document.getElementById(element);
    } else {
      this._container = element;
    }

    this._container.style.position = 'relative';
    this._views = {};
    this._editor = editor;
  };

  public addView(id: string, label: string, color: string, viewRows: RowRange, cursorRow: number) {
    const indicator = new AceRadarViewIndicator(
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

  public hasView(id: string): boolean {
    return this._views[id] !== undefined;
  }

  public setViewRows(id: string, rows: RowRange) {
    const indicator = this._views[id];
    indicator.setViewRows(rows);
  }

  public setCursorRow(id: string, row: number) {
    const indicator = this._views[id];
    indicator.setCursorRow(row);
  }

  public removeView(id: string): void {
    const indicator = this._views[id];
    indicator.dispose();
    delete this._views[id];
  }
}
