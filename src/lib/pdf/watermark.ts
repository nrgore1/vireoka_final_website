import { PDFDocument, rgb, degrees } from "pdf-lib";

export async function watermarkPdf(
  pdfBytes: Uint8Array,
  label: string
) {
  const pdf = await PDFDocument.load(pdfBytes);
  const pages = pdf.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawText(label, {
      x: width / 5,
      y: height / 2,
      size: 28,
      rotate: degrees(-30),
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.4,
    });
  }

  return await pdf.save();
}
