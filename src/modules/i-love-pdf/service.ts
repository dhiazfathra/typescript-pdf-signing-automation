import * as fs from "fs";
import * as path from "path";
import puppeteer from "puppeteer";
import { ILOVEPDF_SELECTORS } from "../../constants";
import { SignPDFConfig, SignPDFResult } from "../../types";

/**
 * Delay execution for specified milliseconds
 * @param ms milliseconds to wait
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Automates the process of signing a PDF using ilovepdf.com
 * @param config Configuration options for the signing process
 * @returns Promise resolving to the result of the signing operation
 */
export async function signPDF(config: SignPDFConfig): Promise<SignPDFResult> {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  try {
    console.log("Starting browser session...");
    const page = await browser.newPage();

    // Set download behavior
    const downloadPath = path.resolve(process.cwd(), "downloads");
    const client = await page.createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadPath,
    });

    // Navigate to the service
    console.log("Navigating to service URL:", config.serviceUrl);
    await page.goto(config.serviceUrl);
    await delay(2000);

    // Upload PDF file
    console.log("Preparing to upload PDF:", config.pdfPath);
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click(ILOVEPDF_SELECTORS.UPLOAD_AREA),
    ]);
    await fileChooser.accept([config.pdfPath]);

    // Wait for upload to complete
    console.log("Uploading PDF...");
    await page.waitForSelector(ILOVEPDF_SELECTORS.ONLY_ME_BUTTON, {
      visible: true,
      timeout: 30000,
    });
    await delay(2000);

    // Click "Only me"
    console.log('Selecting "Only me" option...');
    await page.click(ILOVEPDF_SELECTORS.ONLY_ME_BUTTON);
    await delay(1000);

    // Enter signer name
    console.log("Entering signer name:", config.signerName);
    await page.waitForSelector(ILOVEPDF_SELECTORS.SIGNER_NAME_INPUT, {
      visible: true,
    });
    await page.type(ILOVEPDF_SELECTORS.SIGNER_NAME_INPUT, config.signerName);
    await delay(1000);

    // Click Apply button
    console.log("Applying signature settings...");
    await page.click(ILOVEPDF_SELECTORS.APPLY_BUTTON);
    await delay(2000);

    // Click signature element to add it to the document
    console.log("Adding signature to document...");
    await page.waitForSelector(ILOVEPDF_SELECTORS.SIGNATURE_TO_BE_CLICKED, {
      visible: true,
    });
    await page.click(ILOVEPDF_SELECTORS.SIGNATURE_TO_BE_CLICKED);
    await delay(1000);

    // Update signature positions
    console.log("Setting signature position:", config.signaturePosition);
    await page.evaluate(
      (position, selectors) => {
        // Update position for the signature group container
        const groupElement = document.querySelector(
          selectors.SIGNATURE_COORDINATE_1
        );
        if (groupElement instanceof HTMLElement) {
          groupElement.style.top = `${position.y}px`;
          groupElement.style.left = `${position.x}px`;
        }

        // Update position for the signature element itself
        const signatureElement = document.querySelector(
          ".sign__element.sign__element--signature.fileA.tooltip.selfsigned.ds-selectable.ds-selected"
        );
        if (signatureElement instanceof HTMLElement) {
          signatureElement.style.top = `${position.y}px`;
          signatureElement.style.left = `${position.x}px`;
        }
      },
      config.signaturePosition,
      {
        SIGNATURE_COORDINATE_1: "#groupActions",
      }
    );
    await delay(2000);

    // Process the signing
    console.log("Processing signature...");
    await page.click(ILOVEPDF_SELECTORS.PROCESS_BUTTON);

    // Wait for processing to complete and download button to appear
    console.log("Waiting for processing to complete...");
    await page.waitForSelector(ILOVEPDF_SELECTORS.DOWNLOAD_BUTTON, {
      visible: true,
      timeout: 60000,
    });
    await delay(3000);

    // Setup download listener before clicking download
    console.log("Setting up download handler...");
    const downloadPromise = new Promise((resolve, reject) => {
      page.on("response", async (response) => {
        const contentType = response.headers()["content-type"];

        if (contentType?.includes("application/pdf")) {
          try {
            const buffer = await response.buffer();
            const fileName = `signed_${Date.now()}.pdf`;
            const filePath = path.join(downloadPath, fileName);
            fs.writeFileSync(filePath, buffer);
            resolve(filePath);
          } catch (err) {
            reject(
              new Error(err instanceof Error ? err.message : "Download failed")
            );
          }
        }
      });
    });

    // Click download button
    console.log("Initiating download...");
    await page.click(ILOVEPDF_SELECTORS.DOWNLOAD_BUTTON);

    // Wait for download to complete
    console.log("Waiting for download to complete...");
    const downloadedFilePath = (await Promise.race([
      downloadPromise,
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Download timeout after 30 seconds")),
          30000
        )
      ),
    ])) as string;

    console.log("Download completed successfully:", downloadedFilePath);
    return {
      success: true,
      signedPdfPath: downloadedFilePath,
    };
  } catch (error) {
    console.error("Error during PDF signing:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  } finally {
    console.log("Closing browser session...");
    await browser.close();
  }
}
