export function normalizePdfFileName(fileName: string): string {
  return fileName.toLowerCase().endsWith(".pdf") ? fileName : `${fileName}.pdf`;
}

export function base64ToBlob(base64: string, mimeType: string): Blob {
  const binaryString = window.atob(base64);
  const binaryLength = binaryString.length;
  const bytes = new Uint8Array(binaryLength);

  for (let index = 0; index < binaryLength; index += 1) {
    bytes[index] = binaryString.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}

export function createPdfBlobUrl(base64: string, mimeType: string): string {
  const pdfBlob = base64ToBlob(base64, mimeType);
  return URL.createObjectURL(pdfBlob);
}

export function downloadPdfFile(
  base64: string,
  mimeType: string,
  fileName: string,
): void {
  const downloadUrl = createPdfBlobUrl(base64, mimeType);
  const anchor = document.createElement("a");

  anchor.href = downloadUrl;
  anchor.download = normalizePdfFileName(fileName);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  window.setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 1000);
}
