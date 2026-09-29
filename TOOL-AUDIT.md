# IYONM tool audit

## Evidence

All 58 registered tool routes passed the HTTP rendering audit. Production compilation, TypeScript checking, and static generation of 226 pages pass. Desktop Edge browser tests exercise real inputs, workers, downloads, and calculations.

* `test-browser-tools.cjs`: 19 checks for encryption, unlocking, PDF/JSON/ZIP exports, merging, rotation, numbering, QR, JSON formatting, Unicode Base64, arithmetic, and regex timeout.
* `test-browser-media.cjs`: 8 checks for compression, resizing, image-to-PDF, background removal, upscaling, OCR, MP4 encoding, and GIF encoding.
* `test-browser-editing.cjs`: 13 checks for splitting, extraction, removal, watermarking, organization, cropping, editing, signing, redaction, AcroForm filling, Markdown, reflow, and DOCX conversion.
* `test-browser-utilities.cjs`: 19 checks for encoding, hashes, UUIDs, JWTs, env validation, text comparison, words, stopwatch, timer, age, units, spreadsheets, percentages, loans, contract scanning, PDF comparison, JPG-to-PDF, image scanning, and PNG-to-WebP.

## Repairs

* Protect PDF now performs real AES-256 encryption using QPDF in a local worker. Unlock PDF decrypts without rasterizing pages. Password confirmation, UTF-8 length validation, worker termination, and timeout are enforced. Engine tests verify wrong-password rejection and restored pages.
* Important: the earlier protection implementation did not encrypt output and could write passwords into metadata. Previous outputs must not be considered protected. Change any password reused elsewhere.
* PDF.js uses a locally served, version-matched worker. Compression and repair no longer ignore encryption.
* Regex runs in a disposable worker with a one-second timeout and capped results.
* Comparison tools use bounded typed-array storage and explain oversized inputs. PDF comparison rejects empty extraction.
* Redaction supports pointer input, preserves page dimensions, clears stale output, and exports rasterized PNG pages.
* Timer completion now stays at zero. Age calculations handle month-end boundaries in UTC.
* Resizing validates dimensions and uses the actual MIME type for filenames. Conversion reports individual failures, handles HEIC array output, converts through PNG for WebP, and rejects unsupported encodings.
* Background removal retries on CPU after GPU failure. OCR and upscaler resources are disposed after processing.
* FFmpeg output checks exit codes, overwrites existing outputs, cleans successful jobs, and permits retries after initialization failure.
* Camera scanning releases camera tracks on unmount and waits for usable dimensions. FileReader errors no longer hang.
* DOCX rendering strips external resource references and unsafe attributes. Temporary DOM is removed on failure.
* PDF-to-Word and Excel reject empty extraction. Form loading clears stale fields. DropZone catches callback failures and permits reselecting the same file. Split ranges reject invalid selections.

## Remaining compatibility work

This is not a universal functionality certification. Generated fixtures on desktop Edge cannot certify every input or device. HEIC camera variants, physical mobile Safari/Android devices, live camera permissions, very large files, offline model availability, OCR accuracy, and segmentation quality require dedicated tests.

PDF-to-Word/Excel extract content, not pixel-perfect layouts. Contract scanning is rule-based, not legal advice. Redaction intentionally loses selectable text and forms. OCR extracts text within its documented page range, not a searchable PDF. Already optimized files may not compress further. Restricted networks can block model/runtime downloads.

## Repeatable checks

Start localhost for browser tests. Scripts use installed Microsoft Edge on Windows.

* `npm run test:tools`
* `node scripts/audit-tool-routes.cjs`
* `node scripts/test-file-engines.cjs`
* `node scripts/test-pdf-security.cjs`
* `node scripts/test-document-renamer.cjs`
* `node scripts/test-pdf-structure.cjs`
* `node node_modules/typescript/bin/tsc --noEmit --incremental false`
* `npm run build`
