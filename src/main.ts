import path from "path";
import { signPDF } from "./index";
import { SignPDFConfig } from "./types";

/**
 * Example configuration for PDF signing
 * @returns Configuration object with default values
 */
function getDefaultConfig(): SignPDFConfig {
  return {
    serviceUrl: "https://www.ilovepdf.com/sign-pdf",
    pdfPath: path.join(__dirname, "../documents/sample.pdf"),
    signerName: "Test User",
    signaturePosition: {
      x: 100, // Default X coordinate for signature
      y: 200, // Default Y coordinate for signature
    },
  };
}

/**
 * Parse command line arguments to override default configuration
 * @param defaultConfig Default configuration object
 * @returns Configuration with any command line overrides applied
 */
function parseCommandLineArgs(defaultConfig: SignPDFConfig): SignPDFConfig {
  const args = process.argv.slice(2);
  const config = { ...defaultConfig };

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace("--", "");
    const value = args[i + 1];

    switch (key) {
      case "pdf":
        config.pdfPath = value;
        break;
      case "name":
        config.signerName = value;
        break;
      case "x":
        config.signaturePosition.x = parseInt(value, 10);
        break;
      case "y":
        config.signaturePosition.y = parseInt(value, 10);
        break;
    }
  }

  return config;
}

/**
 * Validate the configuration
 * @param config Configuration to validate
 * @throws Error if configuration is invalid
 */
function validateConfig(config: SignPDFConfig): void {
  if (!config.pdfPath) {
    throw new Error("PDF path is required");
  }
  if (!config.signerName) {
    throw new Error("Signer name is required");
  }
  if (isNaN(config.signaturePosition.x) || isNaN(config.signaturePosition.y)) {
    throw new Error("Invalid signature position coordinates");
  }
}

/**
 * Main function to run the PDF signing process
 */
async function main(): Promise<void> {
  try {
    // Get default configuration and apply any command line overrides
    const config = parseCommandLineArgs(getDefaultConfig());

    // Validate the configuration
    validateConfig(config);

    console.log("Starting PDF signing process with configuration:", config);

    // Run the signing process
    const result = await signPDF(config);

    if (result.success) {
      console.log("PDF signed successfully!");
      console.log("Download URL:", result.signedPdfPath);
    } else {
      console.error("Failed to sign PDF:", result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main();
}

export { main };
