import * as ace from "brace";
import { IIndexRange } from "./IndexRange";
import { IRowRange } from "./RowRange";

export class AceViewportUtil {

  public static getVisibleIndexRange(editor: ace.Editor): IIndexRange {
    let firstRow: number = editor.getFirstVisibleRow();
    let lastRow: number = editor.getLastVisibleRow();

    if (!editor.isRowFullyVisible(firstRow)) {
      firstRow++;
    }

    if (!editor.isRowFullyVisible(lastRow)) {
      lastRow--;
    }

    const startPos: number = editor.getSession().getDocument().positionToIndex({row: firstRow, column: 0}, 0);

    // todo, this should probably be the end of the row
    const endPos: number = editor.getSession().getDocument().positionToIndex({row: lastRow, column: 0}, 0);

    return {
      start: startPos,
      end: endPos
    };
  }

  public static indicesToRows(editor: ace.Editor, startIndex: number, endIndex: number): IRowRange {
    const startRow: number = editor.getSession().getDocument().indexToPosition(startIndex, 0).row;
    const endRow: number = editor.getSession().getDocument().indexToPosition(endIndex, 0).row;

    return {
      start: startRow,
      end: endRow
    };
  }
}
