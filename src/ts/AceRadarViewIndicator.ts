import {Ace} from "ace-builds";
import {IRowRange} from "./RowRange";

export class AceRadarViewIndicator {

  private readonly _label: string;
  private readonly _color: string;
  private readonly _editorListener: () => void;
  private readonly _scrollElement: HTMLDivElement;
  private readonly _cursorElement: HTMLDivElement;
  private readonly _wrapper: HTMLDivElement;
  private _viewRows: IRowRange;
  private _cursorRow: number;
  private _editor: Ace.Editor;
  private _docLineCount: number;

  constructor(label: string, color: string, viewRows: IRowRange, cursorRow: number, editor: Ace.Editor) {
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
    this._editor.on("change", this._editorListener);

    this._scrollElement = document.createElement("div");
    this._scrollElement.className = "ace-radar-view-scroll-indicator";

    this._scrollElement.style.borderColor = this._color;
    this._scrollElement.style.background = this._color;

    // todo implement a custom tooltip for consistent presentation.
    this._scrollElement.title = this._label;

    this._scrollElement.addEventListener("click", () => {
      const middle = ((this._viewRows.end - this._viewRows.start) / 2) + this._viewRows.start;

      this._editor.scrollToLine(middle, true, false, () => { /* no-op */
      });
    }, false);

    this._cursorElement = document.createElement("div");
    this._cursorElement.className = "ace-radar-view-cursor-indicator";
    this._cursorElement.style.background = this._color;
    this._cursorElement.title = this._label;

    this._cursorElement.addEventListener("click", () => {
      this._editor.scrollToLine(this._cursorRow, true, false, () => { /* no-op */
      });
    }, false);

    this._wrapper = document.createElement("div");
    this._wrapper.className = "ace-radar-view-wrapper";
    this._wrapper.style.display = "none";

    this._wrapper.appendChild(this._scrollElement);
    this._wrapper.appendChild(this._cursorElement);
  }

  public element(): HTMLDivElement {
    return this._wrapper;
  }

  public setCursorRow(cursorRow: number): void {
    this._cursorRow = cursorRow;
    this.update();
  }

  public setViewRows(viewRows: IRowRange): void {
    this._viewRows = viewRows;
    this.update();
  }

  public update(): void {
    if (!_isSet(this._viewRows) && !_isSet(this._cursorRow)) {
      this._wrapper.style.display = "none";
    } else {
      this._wrapper.style.display = null;
      const maxLine = this._docLineCount - 1;

      if (!_isSet(this._viewRows)) {
        this._scrollElement.style.display = "none";
      } else {
        const topPercent = Math.min(maxLine, this._viewRows.start) / maxLine * 100;
        const bottomPercent = 100 - (Math.min(maxLine, this._viewRows.end) / maxLine * 100);

        this._scrollElement.style.top = topPercent + "%";
        this._scrollElement.style.bottom = bottomPercent + "%";
        this._scrollElement.style.display = null;
      }

      if (!_isSet(this._cursorRow)) {
        this._cursorElement.style.display = "none";
      } else {
        const cursorPercent = Math.min(this._cursorRow, maxLine) / maxLine;
        const ratio = (this._wrapper.offsetHeight - this._cursorElement.offsetHeight) / this._wrapper.offsetHeight;
        const cursorTop = cursorPercent * ratio * 100;

        this._cursorElement.style.top = cursorTop + "%";
        this._cursorElement.style.display = null;
      }
    }
  }

  public dispose(): void {
    this._wrapper.parentNode.removeChild(this._wrapper);
    this._editor.off("change", this._editorListener);
  }
}

function _isSet(value: any): boolean {
  return value !== undefined && value !== null;
}
