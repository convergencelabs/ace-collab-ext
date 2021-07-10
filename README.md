## Ace Collaborative Extensions
[![example workflow](https://github.com/convergencelabs/ace-collab-ext/actions/workflows/build.yml/badge.svg)](https://github.com/convergencelabs/ace-collab-ext/actions/workflows/build.yml)

Enhances the [Ace Editor](https://github.com/ajaxorg/ace) by adding the ability to render cues about what remote users are doing in the system.

## Installation

Install package with NPM and add it to your development dependencies:

For versions >= 0.5.0 (current):
```npm install --save-dev @convergencelabs/ace-collab-ext```

For versions <= 0.4.0 (previous):
```npm install --save-dev @convergence/ace-collab-ext```

## Demo
Go [here](https://examples.convergence.io/examples/ace/) to see a live demo of multiple cursors, multiple selections, and remote scrollbars (Visit on multiple browsers, or even better, point a friend to it too).  This uses [Convergence](https://convergence.io) to handle the synchronization of data and user actions. 

## Usage

### CSS
Be sure to include one of CSS files located in the css directory of the node modules: 

* `css/ace-collab-ext.css`
* `css/ace-collab-ext.min.css`

How to do this will depend on how you are packaging and distributing your application. For example if you are bundling your css / sass / less you might be able to use an `@import` statement or you might `require` it. If you are hotlinking, you might need to at a `<link>` tag to your document.

If you forget to include the styles, its likely that the remote cursors / selections will either not show up, or they will not properly move.

### Multi Cursor Manager
The multi cursor manager allows you to easily render the cursors of other users
working in the same document.  The cursor position can be represented as either
a single linear index or as a 2-dimensional position in the form of
```{row: 0, column: 10}```.

```javascript
const editor = ace.edit("editor");
const curMgr = new AceCollabExt.AceMultiCursorManager(editor.getSession());

// Add a new remote cursor with an id of "uid1", and a color of orange.
curMgr.addCursor("uid1", "User 1", "orange", {row: 0, column: 10});

// Set cursor for "uid1" to index 10.
curMgr.setCursor("uid1", 10);

// Clear the remote cursor for "uid1" without removing it.
curMgr.clearCursor("uid1");

// Remove the remote cursor for "uid1".
curMgr.removeCursor("uid1");
```

### Multi Selection Manager
The multi selection manager allows you to easily render the selection of other
users working in the same document. Selection is represented by an array of 
AceRanges.  A single range is common for normal selection, but multiple ranges 
are needed to support block selection.

```javascript
const AceRange = ace.require("ace/range");

const editor = ace.edit("editor");
const selMgr = new AceCollabExt.AceMultiSelectionManager(editor.getSession());

// A two-line block selection
const initialRanges = [
  new AceRange(0, 0, 0, 10),
  new AceRange(1, 0, 1, 10),
];

// Add a new remote view indicator with an id of "uid1", and a color of orange.
selMgr.addSelection("uid1", "User 1", "orange", initialRanges);

// Set the selection to a new range.
selMgr.setSelection("uid1", new AceRange(10, 0, 11, 10));

// Nullify the selection without removing the marker.
selMgr.clearSelection("uid1");

// Remove the remote view indicator for "uid1".
selMgr.removeSelection("uid1");
```

### Radar View
A radar view indicates where in a document another user is looking and allows
you to easily go to the location in the document.

```javascript
const editor = ace.edit("editor");
const radarView = new AceCollabExt.RadarView("radarView", editor);

// Add a new remote view indicator with an id of "uid1", and a color of orange.
radarView.addView("uid1", "user1", "orange", 0, 20, 0);

// Set the viewport range of the indicator to span rows 10 through 40.
radarView.setViewRows("uid1", 10, 40);

// Set the row location of the cursor to line 10.
radarView.setCursorRow("uid1", 10);

// Remove the remote view indicator for "uid1".
radarView.removeView("uid1");
```
