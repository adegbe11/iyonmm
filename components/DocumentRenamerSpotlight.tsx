import Link from 'next/link';
import './document-renamer-spotlight.css';

export default function DocumentRenamerSpotlight() {
  return <section className="renamer-spotlight" aria-labelledby="renamer-spotlight-title">
    <div className="renamer-spotlight-inner">
      <div className="renamer-preview" aria-hidden="true">
        <div className="renamer-paper renamer-paper-back" />
        <div className="renamer-folder">
          <div className="renamer-preview-toolbar"><span /><span /><span /><span className="renamer-preview-title">document.json</span></div>
          <div className="json-spotlight-source"><span className="renamer-pdf-mark">PDF</span><span>Project notes</span><span aria-hidden="true">→</span><span className="json-output-mark">{'{ }'}</span></div>
          <pre className="json-spotlight-code">{'{\n  "pages": [\n    {\n      "number": 1,\n      "blocks": [\n        { "text": "Project notes" }\n      ]\n    }\n  ]\n}'}</pre>
          <p className="renamer-example">Example output</p>
        </div>
      </div>
      <div className="renamer-spotlight-copy">
        <h2 id="renamer-spotlight-title">From PDF to usable data.</h2>
        <p>Extract text and document details into structured JSON. Review the results, then download. Your files stay on your device.</p>
        <Link className="renamer-spotlight-cta" href="/pdf-to-json">Convert PDF to JSON <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  </section>;
}
