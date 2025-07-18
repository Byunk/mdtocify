/**
 * Configuration options for table of contents generation
 */
export interface Options {
  /** Minimum heading depth to include (1-6) */
  minDepth: number;
  /** Maximum heading depth to include (1-6) */
  maxDepth: number;
  /** Optional regex pattern to skip matching headings */
  skip?: string;
  /** Optional filter function to exclude headings (return true to exclude) */
  filter?: (str: string) => boolean;
}

/**
 * Represents a single table of contents item
 */
export interface TocItem {
  /** The text content of the heading */
  content: string;
  /** URL-friendly slug generated from the content */
  slug: string;
  /** The heading level (1-6) */
  level: number;
}
