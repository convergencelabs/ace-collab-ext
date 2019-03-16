import {Ace, Range} from "ace-builds";

export interface IRangeData {
  start: {row: number, column: number};
  end: {row: number, column: number};
}

/**
 * A helper class for working with Ace Ranges.
 */
export class AceRangeUtil {

  public static rangeToJson(range: Ace.Range): IRangeData {
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

  public static jsonToRange(range: IRangeData): Ace.Range {
    return new Range(
      range.start.row,
      range.start.column,
      range.end.row,
      range.end.column);
  }

  public static rangesToJson(ranges: Ace.Range[]): IRangeData[] {
    return ranges.map((range) => {
      return AceRangeUtil.rangeToJson(range);
    });
  }

  public static jsonToRanges(ranges: IRangeData[]): Ace.Range[] {
    return ranges.map((range) => {
      return AceRangeUtil.jsonToRange(range);
    });
  }

  public static toJson(value: Ace.Range): IRangeData;
  public static toJson(value: Ace.Range[]): IRangeData[];
  public static toJson(value: Ace.Range | Ace.Range[]) {
    if (Array.isArray(value)) {
      return AceRangeUtil.rangesToJson(value);
    }

    return AceRangeUtil.rangeToJson(value);
  }

  public static fromJson(value: IRangeData): Ace.Range;
  public static fromJson(value: IRangeData[]): Ace.Range[];
  public static fromJson(value: IRangeData | IRangeData[]): Ace.Range | Ace.Range[] {
    if (Array.isArray(value)) {
      return AceRangeUtil.jsonToRanges(value);
    }

    return AceRangeUtil.jsonToRange(value);
  }
}
