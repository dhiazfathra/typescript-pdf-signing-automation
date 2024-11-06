/**
 * Configuration options for PDF signing automation
 */
export interface SignPDFConfig {
  /** URL of the PDF signing service */
  serviceUrl: string;
  /** Path to the PDF file to be signed */
  pdfPath: string;
  /** Name of the signer */
  signerName: string;
  /** Coordinates for signature placement */
  signaturePosition: {
    x: number;
    y: number;
  };
}

/**
 * Result of the PDF signing operation
 */
export interface SignPDFResult {
  /** Whether the signing was successful */
  success: boolean;
  /** Path to the signed PDF if successful */
  signedPdfPath?: string;
  /** Error message if unsuccessful */
  error?: string;
}
