import { toc, defaultOptions, toExpression } from "../src/toc";
import loremIpsum from "./fixture/lorem-ipsum.js";

describe("mdtocify", () => {
  describe("toc", () => {
    it("should return an array of TOC items", () => {
      const result = toc(loremIpsum);
      expect(result).toEqual([
        { content: "Praeter stat", slug: "praeter-stat", level: 1 },
        {
          content: "Conplet Cyllaron armigerae promptior quem",
          slug: "conplet-cyllaron-armigerae-promptior-quem",
          level: 2,
        },
        {
          content: "Corpus in spectat formidine dat",
          slug: "corpus-in-spectat-formidine-dat",
          level: 2,
        },
        {
          content: "Sedit loci ait bracchia nullos sonitum petens",
          slug: "sedit-loci-ait-bracchia-nullos-sonitum-petens",
          level: 2,
        },
        { content: "Illis quos sic", slug: "illis-quos-sic", level: 2 },
      ]);
    });

    it("should skip headings that match the skip option", () => {
      const result = toc(loremIpsum, { skip: "Corpus in spectat formidine dat" });
      expect(result).toEqual([
        { content: "Praeter stat", slug: "praeter-stat", level: 1 },
        {
          content: "Conplet Cyllaron armigerae promptior quem",
          slug: "conplet-cyllaron-armigerae-promptior-quem",
          level: 2,
        },
        {
          content: "Sedit loci ait bracchia nullos sonitum petens",
          slug: "sedit-loci-ait-bracchia-nullos-sonitum-petens",
          level: 2,
        },
        { content: "Illis quos sic", slug: "illis-quos-sic", level: 2 },
      ]);
    });

    it("should filter headings that match the filter option", () => {
      const result = toc(loremIpsum, {
        filter: (str) => str.includes("Conplet Cyllaron"),
      });
      expect(result).toEqual([
        { content: "Praeter stat", slug: "praeter-stat", level: 1 },
        {
          content: "Corpus in spectat formidine dat",
          slug: "corpus-in-spectat-formidine-dat",
          level: 2,
        },
        {
          content: "Sedit loci ait bracchia nullos sonitum petens",
          slug: "sedit-loci-ait-bracchia-nullos-sonitum-petens",
          level: 2,
        },
        { content: "Illis quos sic", slug: "illis-quos-sic", level: 2 },
      ]);
    });

    it("should throw TypeError for non-string input", () => {
      expect(() => toc(null as unknown as string)).toThrow(TypeError);
      expect(() => toc(undefined as unknown as string)).toThrow(TypeError);
      expect(() => toc(123 as unknown as string)).toThrow(TypeError);
    });

    it("should handle empty string input", () => {
      const result = toc("");
      expect(result).toEqual([]);
    });

    it("should respect minDepth and maxDepth options", () => {
      const result = toc(loremIpsum, { minDepth: 2, maxDepth: 2 });
      expect(result).toEqual([
        {
          content: "Conplet Cyllaron armigerae promptior quem",
          slug: "conplet-cyllaron-armigerae-promptior-quem",
          level: 2,
        },
        {
          content: "Corpus in spectat formidine dat",
          slug: "corpus-in-spectat-formidine-dat",
          level: 2,
        },
        {
          content: "Sedit loci ait bracchia nullos sonitum petens",
          slug: "sedit-loci-ait-bracchia-nullos-sonitum-petens",
          level: 2,
        },
        { content: "Illis quos sic", slug: "illis-quos-sic", level: 2 },
      ]);
    });

    it("should handle markdown with various heading levels", () => {
      const markdown = `
# Level 1
## Level 2
### Level 3
#### Level 4
##### Level 5
###### Level 6
`;
      const result = toc(markdown);
      expect(result).toEqual([
        { content: "Level 1", slug: "level-1", level: 1 },
        { content: "Level 2", slug: "level-2", level: 2 },
        { content: "Level 3", slug: "level-3", level: 3 },
        { content: "Level 4", slug: "level-4", level: 4 },
        { content: "Level 5", slug: "level-5", level: 5 },
        { content: "Level 6", slug: "level-6", level: 6 },
      ]);
    });

    it("should generate unique slugs for duplicate headings", () => {
      const markdown = `
# Introduction
## Introduction
### Introduction
`;
      const result = toc(markdown);
      expect(result).toEqual([
        { content: "Introduction", slug: "introduction", level: 1 },
        { content: "Introduction", slug: "introduction-1", level: 2 },
        { content: "Introduction", slug: "introduction-2", level: 3 },
      ]);
    });

    it("should handle headings with special characters", () => {
      const markdown = `
# Hello, World!
## C++ Programming
### File.txt Analysis
`;
      const result = toc(markdown);
      expect(result).toEqual([
        { content: "Hello, World!", slug: "hello-world", level: 1 },
        { content: "C++ Programming", slug: "c-programming", level: 2 },
        { content: "File.txt Analysis", slug: "filetxt-analysis", level: 3 },
      ]);
    });
  });

  describe("defaultOptions", () => {
    it("should return default options when no options are provided", () => {
      const result = defaultOptions();
      expect(result).toEqual({
        minDepth: 1,
        maxDepth: 6,
      });
    });

    it("should merge default options with partial provided options", () => {
      const options = {
        minDepth: 3,
      };
      const result = defaultOptions(options);
      expect(result).toEqual({
        minDepth: 3,
        maxDepth: 6,
      });
    });

    it("should override all default options when provided", () => {
      const options = {
        minDepth: 2,
        maxDepth: 4,
        skip: "test",
        filter: (str: string) => str.includes("skip"),
      };
      const result = defaultOptions(options);
      expect(result).toEqual({
        minDepth: 2,
        maxDepth: 4,
        skip: "test",
        filter: options.filter,
      });
    });

    it("should handle undefined input gracefully", () => {
      const result = defaultOptions(undefined);
      expect(result).toEqual({
        minDepth: 1,
        maxDepth: 6,
      });
    });
  });

  describe("toExpression", () => {
    it("should create a case-insensitive regex from a string", () => {
      const regex = toExpression("test");
      expect(regex).toBeInstanceOf(RegExp);
      expect(regex.test("test")).toBe(true);
      expect(regex.test("TEST")).toBe(true);
      expect(regex.test("Test")).toBe(true);
    });

    it("should match exact strings only", () => {
      const regex = toExpression("test");
      expect(regex.test("test")).toBe(true);
      expect(regex.test("testing")).toBe(false);
      expect(regex.test("pretest")).toBe(false);
    });

    it("should throw TypeError for non-string input", () => {
      expect(() => toExpression(null as unknown as string)).toThrow(TypeError);
      expect(() => toExpression(undefined as unknown as string)).toThrow(TypeError);
      expect(() => toExpression(123 as unknown as string)).toThrow(TypeError);
    });

    it("should handle special regex characters by escaping them", () => {
      const regex = toExpression("test.example");
      expect(regex.test("test.example")).toBe(true);
      expect(regex.test("testxexample")).toBe(false);
    });

    it("should handle patterns with regex metacharacters", () => {
      const regex = toExpression("test*pattern");
      expect(regex.test("test*pattern")).toBe(true);
      expect(regex.test("testXpattern")).toBe(false);
    });

    it("should handle empty string input", () => {
      const regex = toExpression("");
      expect(regex.test("")).toBe(true);
      expect(regex.test("anything")).toBe(false);
    });

    it("should escape all regex special characters", () => {
      const specialChars = ".*+?^${}()|[]\\";
      const regex = toExpression(specialChars);
      expect(regex.test(specialChars)).toBe(true);
      expect(regex.test("different")).toBe(false);
    });

    it("should handle unicode characters", () => {
      const unicode = "测试 🎉 emoji";
      const regex = toExpression(unicode);
      expect(regex.test(unicode)).toBe(true);
      expect(regex.test("测试")).toBe(false);
    });
  });

  describe("integration", () => {
    it("should work with complex skip patterns", () => {
      const markdown = `
# Introduction
## Getting Started
### Installation
## Advanced Topics
### Configuration
`;
      const result = toc(markdown, {
        skip: "Getting Started",
        minDepth: 1,
        maxDepth: 3,
      });
      expect(result).toEqual([
        { content: "Introduction", slug: "introduction", level: 1 },
        { content: "Installation", slug: "installation", level: 3 },
        { content: "Advanced Topics", slug: "advanced-topics", level: 2 },
        { content: "Configuration", slug: "configuration", level: 3 },
      ]);
    });

    it("should combine filter and skip options", () => {
      const markdown = `
# Main Title
## Skip This
## Filter This Out
## Keep This
`;
      const result = toc(markdown, {
        skip: "Skip This",
        filter: (str) => str.includes("Filter"),
      });
      expect(result).toEqual([
        { content: "Main Title", slug: "main-title", level: 1 },
        { content: "Keep This", slug: "keep-this", level: 2 },
      ]);
    });
  });
});