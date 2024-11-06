# PDF Signer Automation

This TypeScript project automates the process of signing PDFs using Puppeteer and ilovepdf.com.

## Features

- Automated PDF upload and signing
- Configurable signature positioning
- Custom signer name
- Headless browser automation
- Type-safe configuration
- Command-line interface for easy usage

## Installation

```bash
bun install
```

## Usage

### Command Line

Run the script with default configuration:
```bash
bun run sign
```

Run with custom parameters:
```bash
bun run sign -- --pdf ./path/to/document.pdf --name "John Doe" --x 150 --y 250
```

Available command line options:
- `--pdf`: Path to the PDF file (required)
- `--name`: Signer name (required)
- `--x`: X coordinate for signature placement
- `--y`: Y coordinate for signature placement

### Programmatic Usage

```typescript
import { signPDF } from './dist';

async function main() {
  const result = await signPDF({
    serviceUrl: 'https://www.ilovepdf.com/sign-pdf',
    pdfPath: '/path/to/your/document.pdf',
    signerName: 'John Doe',
    signaturePosition: {
      x: 100,
      y: 200
    }
  });

  if (result.success) {
    console.log('PDF signed successfully:', result.signedPdfPath);
  } else {
    console.error('Failed to sign PDF:', result.error);
  }
}
```

## Project Structure

- `src/main.ts` - Command-line interface and runner
- `src/index.ts` - Main implementation
- `src/types.ts` - TypeScript interfaces
- `src/constants.ts` - CSS selectors and constants
- `dist/` - Compiled JavaScript files

## Development

1. Build the project:
```bash
bun run build
```

2. Run with automatic reloading during development:
```bash
bun run dev
```

3. Format code:
```bash
bun run format
```

4. Lint code:
```bash
bun run lint
```

## Project Setup

1. Create a `documents` directory in the project root:
```bash
mkdir documents
```

2. Place your PDF file in the `documents` directory or specify a custom path using the `--pdf` parameter

## Requirements

- Node.js >= 14
- bun >= 6

## License

MIT
