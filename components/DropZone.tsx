"use client";
import { useRef, useState, useEffect, DragEvent, ChangeEvent } from "react";
import { takePendingFiles } from "@/lib/handoff";

interface Props {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void | Promise<void>;
  label?: string;
  sublabel?: string;
}

export default function DropZone({ accept, multiple = false, onFiles, label, sublabel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error,setError] = useState('');
  function dispatch(files: File[]) {
    setError('');
    Promise.resolve().then(()=>onFiles(multiple?files:files.slice(0,1))).catch(()=>setError('Could not read this file. Choose a supported, unprotected file and try again.'));
  }

  // If the user dropped a file on the homepage Universal Dropzone and chose this
  // tool, load it automatically so they never have to select it twice.
  useEffect(() => {
    const handed = takePendingFiles();
    if (handed && handed.length) dispatch(handed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) dispatch(files);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) dispatch(Array.from(e.target.files));
    e.target.value='';
  }

  // Split the label into a bold CTA ("Select PDF file") and a soft hint ("or drop PDF here").
  const full = label || "Select file or drop file here";
  const splitIdx = full.toLowerCase().indexOf(" or ");
  const cta = splitIdx > 0 ? full.slice(0, splitIdx) : full;
  const hint = splitIdx > 0 ? full.slice(splitIdx + 1) : "";

  return (
    <div
      className={`drop-zone-glass ${dragging ? "drag-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />

      <div className="dz-inner">
        <button type="button" className="dz-cta" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {cta}
        </button>

        {hint && (
          <p className="dz-hint">{hint}</p>
        )}
        <p className="dz-sub">{sublabel || accept.replace(/\./g, "").toUpperCase()}</p>
        {error && <p role="alert" className="text-sm text-red-700 mt-3">{error}</p>}
      </div>
    </div>
  );
}
