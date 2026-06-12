import type { Metadata } from "next";
import PdfToExcelClient from "./PdfToExcelClient";

export const metadata: Metadata = {
  title: "PDF to Excel Online Free, Convert PDF to XLSX",
  description: "Extract tables and data from a PDF into an Excel (XLSX) spreadsheet, all in your browser. Free, no upload, fully client-side.",
  alternates: { canonical: "https://iyonm.com/pdf-to-excel" },
};

export default function PdfToExcelPage() {
  return <PdfToExcelClient />;
}
