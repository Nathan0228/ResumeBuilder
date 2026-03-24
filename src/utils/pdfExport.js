/**
 * PDF export utility using html2canvas + jspdf.
 *
 * Tailwind CSS v4 emits oklch() colors natively.
 * html2canvas <1.5 cannot parse oklch() — this module resolves that by
 * injecting rgb()-only print styles BEFORE html2canvas runs.
 *
 * Workflow:
 *   1. injectPrintStyles()  — patches <style> tags + inline styles → rgb()
 *   2. html2canvas()        — renders the patched DOM to a canvas
 *   3. cleanup()            — restores original styles (page is unchanged)
 */
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { injectPrintStyles } from './cssColorConvert';

/**
 * Native browser print — the page renders exactly as seen in the preview.
 * window.print() lets the OS print dialog handle PDF generation.
 * @param {Function} onError
 */
export function exportViaNativePrint(onError) {
  try {
    window.print();
    onError?.();
  } catch (err) {
    console.error('[PDF Export] Native print failed:', err);
    onError?.();
  }
}

/**
 * Converts a DOM element to a PDF and triggers download.
 * Falls back to window.print() if the element is not found or an error occurs.
 *
 * @param {string|HTMLElement} element - Element or selector
 * @param {string} filename - Download filename (without .pdf extension)
 * @param {Function} onSuccess - Callback on successful save
 * @param {Function} onError - Callback on error (will call window.print())
 */
export async function exportToPdf(element, filename = 'resume', onSuccess, onError) {
  let target;

  if (typeof element === 'string') {
    target = document.querySelector(element);
  } else {
    target = element;
  }

  if (!target) {
    console.warn('[PDF Export] Target element not found, falling back to window.print()');
    window.print();
    onError?.();
    return;
  }

  let cleanup = null;

  try {
    // Step 1: Inject print-safe styles (convert oklch → rgb) BEFORE html2canvas reads the DOM.
    // This patches <style> tag contents AND inline style attributes.
    cleanup = injectPrintStyles();

    // Step 2: Render to canvas.
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Step 3: Build PDF.
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgHeight = (canvasHeight / canvasWidth) * pdfWidth;

    if (imgHeight <= pdfHeight) {
      // Single page
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
    } else {
      // Multi-page slice
      let position = 0;
      while (position < imgHeight) {
        pdf.addImage(imgData, 'JPEG', 0, -(position * (pdfWidth / canvasWidth)), pdfWidth, imgHeight);
        position += pdfHeight;
        if (position < imgHeight) pdf.addPage();
      }
    }

    pdf.save(`${filename}.pdf`);
    onSuccess?.();
  } catch (err) {
    console.error('[PDF Export] Failed to generate PDF:', err);
    window.print();
    onError?.();
  } finally {
    // Step 4: Always restore original styles, even on error.
    if (cleanup) cleanup();
  }
}
