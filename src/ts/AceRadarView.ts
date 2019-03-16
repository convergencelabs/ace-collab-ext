import {Ace} from "ace-builds";
import {AceRadarViewIndicator} from "./AceRadarViewIndicator";
import {IRowRange} from "./RowRange";

/**
 * Implements viewport awareness in the Ace Editor by showing where remote
 * users are scrolled too and where there cursor is in the document, even
 * if the cursor is not in view.
 */
export class AceRadarView {
  private readonly _views: { [key: string]: AceRadarViewIndicator };
  private readonly _editor: Ace.Editor;
  private _container: HTMLElement;

  /**
   * Constructs a new AceRadarView bound to the supplied element and editor.
   *
   * @param element
   *          The HTML Element that the AceRadarView should render to.
   * @param editor
   *          The Ace Editor to listen to events from.
   */
  constructor(element: HTMLElement | string, editor: Ace.Editor) {
    this._container = null;
    if (typeof element === "string") {
      this._container = document.getElementById(element);
    } else {
      this._container = element;
    }

    this._container.style.position = "relative";
    this._views = {};
    this._editor = editor;
  }

  /**
   * Add a view indicator for a new remote user.
   *
   * @param id
   *          The unique id of the user.
   * @param label
   *          A text label to displAce for the user.
   * @param color
   *          The color to render the indicator with.
   * @param viewRows
   *          The rows the user's viewport spans.
   * @param cursorRow
   *          The row that the user's cursor is on.
   */
  public addView(id: string, label: string, color: string, viewRows: IRowRange, cursorRow: number) {
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

  /**
   * Determines if the AceRadarView has an indicator for this specified user.
   *
   * @param id
   *          The id of the user to check for.
   * @returns
   *   True if the AceRadarView has an indicator for this user, false otherwise.
   */
  public hasView(id: string): boolean {
    return this._views[id] !== undefined;
  }

  /**
   * Sets the view row span for a particular user.
   *
   * @param id
   *          The id of the user to set the rows for.
   * @param rows
   *          The row range to set.
   */
  public setViewRows(id: string, rows: IRowRange) {
    const indicator = this._views[id];
    indicator.setViewRows(rows);
  }

  /**
   * Sets the cursor row for a particular user.
   *
   * @param id
   *          The id of the user to set the cursor row for.
   * @param row
   *          The row to set.
   */
  public setCursorRow(id: string, row: number) {
    const indicator = this._views[id];
    indicator.setCursorRow(row);
  }

  /**
   * Clears the view for a particular user, causing their indicator to disapear.
   * @param id
   *   The id of the user to clear.
   */
  public clearView(id: string): void {
    const indicator = this._views[id];
    indicator.setCursorRow(null);
    indicator.setViewRows(null);
  }

  /**
   * Removes the view indicator for the specified user.
   * @param id
   *   The id of the user to remove the view indicator for.
   */
  public removeView(id: string): void {
    const indicator = this._views[id];
    indicator.dispose();
    delete this._views[id];
  }
}
