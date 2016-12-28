export default class AceViewportUtil {

  static getVisibleIndexRange(editor) {
    let firstRow = editor.getFirstVisibleRow();
    let lastRow = editor.getLastVisibleRow();

    if (!editor.isRowFullyVisible(firstRow)) {
      firstRow++;
    }

    if (!editor.isRowFullyVisible(lastRow)) {
      lastRow--;
    }

    let startPos = editor.getSession().getDocument().positionToIndex({row: firstRow, column: 0});

    // todo, this should probably be the end of the row
    let endPos = editor.getSession().getDocument().positionToIndex({row: lastRow, column: 0});

    return {
      start: startPos,
      end: endPos
    };
  }

  static indicesToRows(editor, startIndex, endIndex) {
    var startRow = editor.getSession().getDocument().indexToPosition(startIndex).row;
    var endRow = editor.getSession().getDocument().indexToPosition(endIndex).row;

    return {
      start: startRow,
      end: endRow
    };
  }

}
