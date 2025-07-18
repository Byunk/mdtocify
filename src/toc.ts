import Slugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { Options, TocItem } from "./types";

const slugger = new Slugger();

/**
 * Merges user-provided options with default values
 * @param options - Partial options object from user
 * @returns Complete options object with defaults applied
 */
export function defaultOptions(options?: Partial<Options>): Options {
  return {
    minDepth: 1,
    maxDepth: 6,
    ...options,
  };
}

/**
 * Converts a string pattern to a case-insensitive regular expression
 * @param value - String pattern to convert
 * @returns RegExp object for pattern matching
 * @throws TypeError if value is not a string
 * @throws Error if the resulting regex pattern is invalid
 */
export function toExpression(value: string): RegExp {
  if (typeof value !== 'string') {
    throw new TypeError('Value must be a string');
  }

  try {
    const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("^(" + escapedValue + ")$", "i");
  } catch {
    throw new Error(`Invalid regular expression pattern: ${value}`);
  }
}

/**
 * Generates a table of contents from Markdown text
 * @param str - The markdown string to parse
 * @param options - Optional configuration for TOC generation
 * @returns Array of TocItem objects representing the table of contents
 * @throws TypeError if input is not a string
 */
export function toc(str: string, options?: Partial<Options>): TocItem[] {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const mergedOptions = defaultOptions(options);
  const skip = mergedOptions.skip ? toExpression(mergedOptions.skip) : null;

  const result: TocItem[] = [];
  const tree = unified().use(remarkParse).parse(str);
  slugger.reset();

  visit(tree, "heading", (node) => {
    const content = toString(node, { includeImageAlt: false });
    const slug = slugger.slug(content);
    const level = node.depth;

    const isWithinDepthRange =
      (!mergedOptions.minDepth || level >= mergedOptions.minDepth) &&
      (!mergedOptions.maxDepth || level <= mergedOptions.maxDepth);

    const isNotSkipped = !skip || !skip.test(content);

    const isNotFiltered =
      !mergedOptions.filter || mergedOptions.filter(content) === false;

    if (isWithinDepthRange && isNotSkipped && isNotFiltered) {
      result.push({ content, slug, level });
    }
  });

  return result;
}
