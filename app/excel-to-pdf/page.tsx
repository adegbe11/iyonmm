import type { Metadata } from "next";
import ExcelToPdfClient from "./ExcelToPdfClient";

export const metadata: Metadata = {
  title: "Excel to PDF Online Free, Convert XLS and XLSX",
  description: "Convert Excel spreadsheets (XLS, XLSX, CSV) to PDF in your browser. Free, no upload, fully client-side. Each sheet rendered as a table.",
  alternates: { canonical: "https://www.iyonm.com/excel-to-pdf" },
};

export default function ExcelToPdfPage() {
  return <ExcelToPdfClient />;
}
