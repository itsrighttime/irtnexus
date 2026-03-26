export type ExtractResult<T> = {
  data: T | T[] | null;
  meta: {
    isArray: boolean;
    isSingle: boolean;
    isEmpty: boolean;
    isNullish: boolean;
    count: number;
    sourceType: "array" | "nested-array" | "single" | "nullish";
  };
};

export function extractRows<T>(
  result: T | T[] | null | undefined,
): ExtractResult<T> {
  if (result == null) {
    return {
      data: null,
      meta: {
        isArray: false,
        isSingle: false,
        isEmpty: true,
        isNullish: true,
        count: 0,
        sourceType: "nullish",
      },
    };
  }

  if (Array.isArray(result)) {
    let rows: T[] = result;

    if (result.length > 0 && Array.isArray(result[0])) {
      rows = result[0] as T[];
    }

    const count = rows.length;

    if (count === 0) {
      return {
        data: [],
        meta: {
          isArray: true,
          isSingle: false,
          isEmpty: true,
          isNullish: false,
          count: 0,
          sourceType: "array",
        },
      };
    }

    if (count === 1) {
      return {
        data: rows[0],
        meta: {
          isArray: false,
          isSingle: true,
          isEmpty: false,
          isNullish: false,
          count: 1,
          sourceType: "array",
        },
      };
    }

    return {
      data: rows,
      meta: {
        isArray: true,
        isSingle: false,
        isEmpty: false,
        isNullish: false,
        count,
        sourceType: "array",
      },
    };
  }

  return {
    data: result,
    meta: {
      isArray: false,
      isSingle: true,
      isEmpty: false,
      isNullish: false,
      count: 1,
      sourceType: "single",
    },
  };
}
