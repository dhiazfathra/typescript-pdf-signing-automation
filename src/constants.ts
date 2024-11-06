/**
 * CSS selectors for interacting with the PDF signing service
 */
export const ILOVEPDF_SELECTORS = {
  /** Area to upload PDF file */
  UPLOAD_AREA: "#pickfiles",
  /** Button to select single signer mode */
  ONLY_ME_BUTTON: "#singleMode > button",
  /** Input field for signer name */
  SIGNER_NAME_INPUT: "#signName",
  /** Button to apply signature settings */
  APPLY_BUTTON: "#confirmSignature",
  /** Button to add signature element */
  SIGNATURE_TO_BE_CLICKED:
    "#addElementSignature > div > div.sign__draggable__preview",
  /** Button to process and complete signing */
  PROCESS_BUTTON: "#processTask",
  /** Download button for signed PDF */
  DOWNLOAD_BUTTON: "#pickfiles",
} as const;
