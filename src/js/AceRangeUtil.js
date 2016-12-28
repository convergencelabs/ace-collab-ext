import {default as ace} from 'ace';

var AceRange = null;

if (ace.acequire !== undefined) {
  AceRange = ace.acequire('ace/range').Range;
} else {
  AceRange = ace.require('ace/range').Range;
}

export default class AceRangeUtil {

  static rangeToJson(range) {
    return {
      'start': {
        'row': range.start.row,
        'column': range.start.column
      },
      'end': {
        'row': range.end.row,
        'column': range.end.column
      }
    };
  }

  static jsonToRange(range) {
    return new AceRange(
      range.start.row,
      range.start.column,
      range.end.row,
      range.end.column);
  }

  static rangesToJson(ranges) {
    return ranges.map((range) => {
      return AceRangeUtil.rangeToJson(range);
    });
  }

  static jsonToRanges(ranges) {
    return ranges.map((range) => {
      return AceRangeUtil.jsonToRange(range);
    });
  }

  static toJson(value) {
    if (value instanceof Array) {
      return AceRangeUtil.rangesToJson(value);
    }

    return AceRangeUtil.rangeToJson(value);
  }

  static fromJson(value) {
    if (value instanceof Array) {
      return AceRangeUtil.jsonToRanges(value);
    }

    return AceRangeUtil.jsonToRange(value);
  }
}
