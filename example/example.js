const sourceUser = {
  id: "source",
  label: "Source User",
  color: "orange"
};

const sourceEditor = initEditor("source-editor");
const sourceSession = sourceEditor.getSession();

const targetEditor = initEditor("target-editor");
targetEditor.setReadOnly(true);

const targetCursorManager = new AceCollabExt.AceMultiCursorManager(targetEditor.getSession());
targetCursorManager.addCursor(sourceUser.id, sourceUser.label, sourceUser.color, 0);

const targetSelectionManager = new AceCollabExt.AceMultiSelectionManager(targetEditor.getSession());
targetSelectionManager.addSelection(sourceUser.id, sourceUser.label, sourceUser.color, []);

const radarView = new AceCollabExt.AceRadarView("target-radar-view", targetEditor);


setTimeout(function() {
  radarView.addView("fake1", "fake1",  "RoyalBlue", {start: 60, end: 75}, 50);
  radarView.addView("fake2", "fake2",  "lightgreen", {start: 10, end: 50}, 30);

  const initialIndices = AceCollabExt.AceViewportUtil.getVisibleIndexRange(sourceEditor);
  const initialRows = AceCollabExt.AceViewportUtil.indicesToRows(sourceEditor, initialIndices.start, initialIndices.end);
  radarView.addView(sourceUser.id, sourceUser.label, sourceUser.color, initialRows, 0);
}, 0);

sourceSession.getDocument().on("change", function(e) {
  targetEditor.getSession().getDocument().applyDeltas([e]);
});

sourceSession.on("changeScrollTop", function (scrollTop) {
  setTimeout(function () {
    const viewportIndices = AceCollabExt.AceViewportUtil.getVisibleIndexRange(sourceEditor);
    const rows = AceCollabExt.AceViewportUtil.indicesToRows(sourceEditor, viewportIndices.start, viewportIndices.end);
    radarView.setViewRows(sourceUser.id, rows);
  }, 0);
});

sourceSession.selection.on('changeCursor', function(e) {
  const cursor = sourceEditor.getCursorPosition();
  targetCursorManager.setCursor(sourceUser.id, cursor);
  radarView.setCursorRow(sourceUser.id, cursor.row);
});

sourceSession.selection.on('changeSelection', function(e) {
  const rangesJson = AceCollabExt.AceRangeUtil.toJson(sourceEditor.selection.getAllRanges());
  const ranges = AceCollabExt.AceRangeUtil.fromJson(rangesJson);
  targetSelectionManager.setSelection(sourceUser.id, ranges);
});

function initEditor(id) {
  const editor = ace.edit(id);
  editor.setTheme('ace/theme/monokai');

  const session = editor.getSession();
  session.setMode('ace/mode/javascript');
  session.setValue(editorContents);

  return editor;
}
