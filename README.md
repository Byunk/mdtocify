# mdtocify

A simple and efficient TypeScript library for generating table of contents (TOC) from Markdown text. Extract headings and create structured navigation for your documentation.

[![npm version](https://badge.fury.io/js/mdtocify.svg)](https://badge.fury.io/js/mdtocify)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Fast and lightweight** - Minimal dependencies, optimized performance
- 📝 **TypeScript support** - Full type safety and IntelliSense
- 🎯 **Flexible filtering** - Skip headings or use custom filters
- 🔗 **URL-friendly slugs** - Automatic slug generation with collision handling
- 📊 **Depth control** - Configure minimum and maximum heading levels
- 🌐 **Unicode support** - Works with international characters and emojis

## Installation

```bash
npm install mdtocify
```

## Quick Start

```typescript
import { toc } from 'mdtocify';

const markdown = `
# Introduction
## Getting Started
### Installation
## API Reference
### Functions
### Types
`;

const result = toc(markdown);
console.log(result);
```

**Output:**
```javascript
[
  { content: 'Introduction', slug: 'introduction', level: 1 },
  { content: 'Getting Started', slug: 'getting-started', level: 2 },
  { content: 'Installation', slug: 'installation', level: 3 },
  { content: 'API Reference', slug: 'api-reference', level: 2 },
  { content: 'Functions', slug: 'functions', level: 3 },
  { content: 'Types', slug: 'types', level: 3 }
]
```

## API Reference

### `toc(markdown, options?)`

Generates a table of contents from Markdown text.

**Parameters:**
- `markdown` (string) - The Markdown content to parse
- `options` (object, optional) - Configuration options

**Returns:**
- `TocItem[]` - Array of table of contents items

**Example:**
```typescript
import { toc } from 'mdtocify';

const result = toc('# Hello\n## World');
// Returns: [
//   { content: 'Hello', slug: 'hello', level: 1 },
//   { content: 'World', slug: 'world', level: 2 }
// ]
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minDepth` | number | `1` | Minimum heading level to include (1-6) |
| `maxDepth` | number | `6` | Maximum heading level to include (1-6) |
| `skip` | string | - | Skip headings that exactly match this string |
| `filter` | function | - | Custom filter function to exclude headings |

### TypeScript Types

```typescript
interface TocItem {
  content: string;  // The heading text
  slug: string;     // URL-friendly slug
  level: number;    // Heading level (1-6)
}

interface Options {
  minDepth?: number;
  maxDepth?: number;
  skip?: string;
  filter?: (heading: string) => boolean;
}
```

## Examples

### Basic Usage

```typescript
import { toc } from 'mdtocify';

const markdown = `
# Main Title
## Section 1
### Subsection 1.1
## Section 2
`;

const result = toc(markdown);
// Returns all headings from level 1-6
```

### Limit Heading Depth

```typescript
const result = toc(markdown, {
  minDepth: 2,  // Only include h2 and below
  maxDepth: 4   // Stop at h4
});
// Returns only headings from level 2-4
```

### Skip Specific Headings

```typescript
const result = toc(markdown, {
  skip: 'Table of Contents'  // Skip any heading with this exact text
});
```

### Custom Filtering

```typescript
const result = toc(markdown, {
  filter: (heading) => {
    // Return true to exclude the heading
    return heading.toLowerCase().includes('private');
  }
});
```

### Real-world Example

```typescript
import { toc } from 'mdtocify';

// Generate navigation for a blog post
const blogPost = `
# How to Build a REST API
## Introduction
## Prerequisites
### Node.js Setup
### Database Setup
## Implementation
### Route Handlers
### Middleware
### Error Handling
## Testing
## Deployment
`;

const navigation = toc(blogPost, {
  minDepth: 2,  // Skip the main title
  maxDepth: 3   // Include up to h3
});

// Use the result to generate navigation HTML
const navHTML = navigation
  .map(item => {
    const indent = '  '.repeat(item.level - 2);
    return `${indent}<a href="#${item.slug}">${item.content}</a>`;
  })
  .join('\n');
```

## Use Cases

- **Documentation sites** - Generate navigation for docs
- **Blog platforms** - Create article table of contents
- **Static site generators** - Build navigation menus
- **Content management** - Extract document structure
- **Markdown processors** - Enhance markdown rendering

## Browser Support

This library uses ES modules and requires Node.js 18+. For browser usage, use with a bundler like Vite, Webpack, or Rollup.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](https://github.com/Byunk/mdtocify/blob/main/CONTRIBUTING.md) and submit pull requests to our [GitHub repository](https://github.com/Byunk/mdtocify).

## License

MIT © [Kyungho Byoun](https://github.com/Byunk)

---

**Need help?** [Open an issue](https://github.com/Byunk/mdtocify/issues) or [view the documentation](https://github.com/Byunk/mdtocify)