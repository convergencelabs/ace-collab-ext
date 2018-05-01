import * as ace from "brace";
import {Range} from "brace";

let AceRange: {
  new(startRow: number, startColumn: number, endRow: number, endColumn: number): Range
};

if (ace.acequire !== undefined) {
  AceRange = ace.acequire("ace/range").Range;
} else {
  AceRange = (ace as any).require("ace/range").Range;
}

export interface IRangeData {
  start: {row: number, column: number};
  end: {row: number, column: number};
}

export class AceRangeUtil {

  public static rangeToJson(range: ace.Range): IRangeData {
    return {
      start: {
        row: range.start.row,
        column: range.start.column
      },
      end: {
        row: range.end.row,
        column: range.end.column
      }
    };
  }

  public static jsonToRange(range: IRangeData): ace.Range {
    return new AceRange(
      range.start.row,
      range.start.column,
      range.end.row,
      range.end.column);
  }

  public static rangesToJson(ranges: ace.Range[]): IRangeData[] {
    return ranges.map((range) => {
      return AceRangeUtil.rangeToJson(range);
    });
  }

  public static jsonToRanges(ranges: IRangeData[]): ace.Range[] {
    return ranges.map((range) => {
      return AceRangeUtil.jsonToRange(range);
    });
  }

  public static toJson(value: ace.Range): IRangeData;
  public static toJson(value: ace.Range[]): IRangeData[];
  public static toJson(value: ace.Range | ace.Range[]) {
    if (Array.isArray(value)) {
      return AceRangeUtil.rangesToJson(value);
    }

    return AceRangeUtil.rangeToJson(value);
  }

  public static fromJson(value: IRangeData): ace.Range;
  public static fromJson(value: IRangeData[]): ace.Range[];
  public static fromJson(value: IRangeData | IRangeData[]): ace.Range | ace.Range[] {
    if (Array.isArray(value)) {
      return AceRangeUtil.jsonToRanges(value);
    }

    return AceRangeUtil.jsonToRange(value);
  }
}
