/**
 * Converts a string to kebab-case.
 * Examples:
 *  "helloWorld" -> "hello-world"
 *  "Hello World" -> "hello-world"
 *  "some_value" -> "some-value"
 *
 * @param str - The input string.
 * @returns The kebab-cased string.
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase to kebab
    .replace(/\s+/g, "-") // spaces to dashes
    .replace(/_+/g, "-") // underscores to dashes
    .toLowerCase();
};

/**
 * Supported output formats for fromKebabCase
 */
export type KebabConvertFormat =
  | "camel"
  | "pascal"
  | "snake"
  | "snake-upper"
  | "sentence"
  | "capitalized";

/**
 * Converts a kebab-case string to other formats.
 *
 * @param str - The kebab-case input string.
 * @param format - Desired output format. Defaults to "camel".
 * @returns Converted string.
 *
 * @example
 * fromKebabCase("hello-world") => "helloWorld"
 * fromKebabCase("hello-world", "pascal") => "HelloWorld"
 * fromKebabCase("hello-world", "snake") => "hello_world"
 */
export const fromKebabCase = (
  str: string,
  format: KebabConvertFormat = "camel",
): string => {
  const words = str.split("-");

  switch (format) {
    case "camel":
      return words
        .map((word, index) =>
          index === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join("");

    case "pascal":
      return words
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join("");

    case "snake":
      return words.map((word) => word.toLowerCase()).join("_");

    case "snake-upper":
      return words.map((word) => word.toUpperCase()).join("_");

    case "sentence":
      return words
        .map((word, index) =>
          index === 0
            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            : word.toLowerCase(),
        )
        .join(" ");

    case "capitalized":
      return words
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");

    default:
      return str; // fallback
  }
};
