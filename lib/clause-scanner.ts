// Client-side contract clause scanner. Pure pattern matching, no AI, no network.
// Honest scope: this flags common red flags by language patterns. It does not
// reason about context the way a lawyer or an LLM would.

export interface Finding {
  title: string;
  severity: "high" | "medium" | "low";
  category: "predatory_clause" | "missing_protection" | "data_privacy" | "fairness_clarity";
  quote: string;
  risk: string;
  regulation: string;
  recommendation: string;
}

export interface ScanResult {
  documentType: string;
  overallRisk: "low" | "medium" | "high";
  summary: string;
  findings: Finding[];
}

interface PresenceRule {
  kind: "present";
  pattern: RegExp;
  title: string;
  severity: Finding["severity"];
  category: Finding["category"];
  risk: string;
  regulation: string;
  recommendation: string;
}
interface AbsenceRule {
  kind: "absent";
  // finding fires only when `need` is missing AND (no `unless` gate, or the gate matches)
  need: RegExp;
  unless?: RegExp;
  title: string;
  severity: Finding["severity"];
  category: Finding["category"];
  risk: string;
  regulation: string;
  recommendation: string;
}
type Rule = PresenceRule | AbsenceRule;

const RULES: Rule[] = [
  // ---- Predatory / one-sided clauses (present = bad) ----
  { kind: "present", pattern: /\b(automatically renew|auto-?renew|evergreen|renews? for (?:successive|additional))\b/i,
    title: "Automatic renewal", severity: "medium", category: "predatory_clause",
    risk: "The contract renews on its own, which can lock you in if you miss a cancellation window.",
    regulation: "General contract best practice",
    recommendation: "Confirm the cancellation notice period and set a reminder, or negotiate renewal to be opt-in." },
  { kind: "present", pattern: /\b(sole discretion|at any time, ?with(?:out)? notice|reserve[s]? the right to (?:change|modify|amend))\b/i,
    title: "Unilateral right to change terms", severity: "high", category: "predatory_clause",
    risk: "One party can change the terms on their own, sometimes without notice. You may be bound by changes you never agreed to.",
    regulation: "General contract best practice",
    recommendation: "Require advance written notice of changes and a right to terminate if you reject them." },
  { kind: "present", pattern: /\b(binding arbitration|class action waiver|waive[s]? (?:any|the) right to (?:a )?(?:jury|class))\b/i,
    title: "Mandatory arbitration / class-action waiver", severity: "high", category: "predatory_clause",
    risk: "You give up the right to sue in court or join a class action, which limits your legal options if something goes wrong.",
    regulation: "General contract best practice",
    recommendation: "Consider whether you are comfortable waiving court access; negotiate a carve-out for small claims if possible." },
  { kind: "present", pattern: /\b(non-?compete|shall not (?:directly or indirectly )?compete|restrictive covenant)\b/i,
    title: "Non-compete clause", severity: "medium", category: "predatory_clause",
    risk: "Restricts where you can work or do business after the relationship ends. Overly broad non-competes can be hard to live with (and unenforceable in some places).",
    regulation: "Varies by jurisdiction",
    recommendation: "Check the duration, geographic scope, and whether non-competes are even enforceable where you are." },
  { kind: "present", pattern: /\b(indemnif(?:y|ication)[\s\S]{0,40}hold harmless|defend,? indemnify)\b/i,
    title: "Broad indemnification", severity: "medium", category: "predatory_clause",
    risk: "You may have to cover the other party's legal costs and losses, potentially well beyond your own fault.",
    regulation: "General contract best practice",
    recommendation: "Make indemnification mutual and cap it to losses caused by your own breach or negligence." },
  { kind: "present", pattern: /\b(liquidated damages|penalt(?:y|ies) of|early termination fee)\b/i,
    title: "Penalties or liquidated damages", severity: "medium", category: "predatory_clause",
    risk: "Fixed penalties or fees may apply, which can be expensive and disproportionate to actual harm.",
    regulation: "General contract best practice",
    recommendation: "Check the amounts are reasonable and tied to genuine pre-estimated loss, not a punishment." },
  { kind: "present", pattern: /\b(work made for hire|assign[s]? all (?:right|title)|hereby assigns? (?:to|all))\b/i,
    title: "Broad IP assignment", severity: "medium", category: "predatory_clause",
    risk: "You may be handing over ownership of intellectual property, possibly beyond the specific work being paid for.",
    regulation: "General contract best practice",
    recommendation: "Limit IP assignment to the specific deliverables, and retain rights to your pre-existing and general tools." },

  // ---- Data privacy ----
  { kind: "present", pattern: /\b(as long as (?:is )?necessary|indefinitely|until you (?:ask|request)|retain[\s\S]{0,30}for any (?:period|length))\b/i,
    title: "Vague data retention period", severity: "medium", category: "data_privacy",
    risk: "Data is kept for an undefined or open-ended time, which conflicts with data-minimisation principles.",
    regulation: "GDPR Art. 5(1)(e) (storage limitation)",
    recommendation: "Specify concrete retention periods per data type and a deletion process." },

  // ---- Absence checks (missing = bad) ----
  { kind: "absent", need: /\b(limitation of liability|in no event shall|liabilit(?:y|ies) (?:is|are|shall be) (?:limited|capped))\b/i,
    title: "No limitation of liability", severity: "high", category: "missing_protection",
    risk: "There is no cap on liability. Without one, exposure to damages can be unlimited.",
    regulation: "General contract best practice",
    recommendation: "Add a mutual liability cap (often tied to fees paid) with standard carve-outs." },
  { kind: "absent", need: /\b(terminat(?:e|ion))\b/i,
    title: "No termination clause", severity: "high", category: "missing_protection",
    risk: "The document does not describe how either side can end the agreement, which can trap you in it.",
    regulation: "General contract best practice",
    recommendation: "Add clear termination rights, including termination for convenience and for cause with a cure period." },
  { kind: "absent", need: /\b(governing law|jurisdiction|governed by the laws)\b/i,
    title: "No governing law / jurisdiction", severity: "medium", category: "missing_protection",
    risk: "It is unclear which laws apply and where disputes are resolved, creating uncertainty if there is a conflict.",
    regulation: "General contract best practice",
    recommendation: "Specify the governing law and the venue for disputes." },
  { kind: "absent", need: /\b(confidential(?:ity)?|non-?disclosure|nda)\b/i,
    title: "No confidentiality clause", severity: "medium", category: "missing_protection",
    risk: "Sensitive information shared under this agreement may not be protected from disclosure.",
    regulation: "General contract best practice",
    recommendation: "Add a mutual confidentiality clause defining what is confidential and how it must be handled." },
  // Privacy absence checks, gated on the document actually involving personal/health data
  { kind: "absent", need: /\b(lawful basis|legal basis|article 6|legitimate interest|consent to process)\b/i,
    unless: /\b(personal data|personal information|process[\s\S]{0,20}data|data subject|gdpr)\b/i,
    title: "No stated lawful basis for processing", severity: "high", category: "data_privacy",
    risk: "The document handles personal data but never states a lawful basis for processing it.",
    regulation: "GDPR Art. 6",
    recommendation: "State the lawful basis (consent, contract, legitimate interest, etc.) for each processing purpose." },
  { kind: "absent", need: /\b(right to (?:erasure|be forgotten|access|portability)|data subject rights|access, ?(?:correct|rectif))\b/i,
    unless: /\b(personal data|personal information|data subject|gdpr|ccpa)\b/i,
    title: "No data-subject rights mechanism", severity: "medium", category: "data_privacy",
    risk: "Personal data is involved but there is no described way for people to access, correct, or delete their data.",
    regulation: "GDPR Arts. 15-20 / CCPA",
    recommendation: "Describe how individuals can exercise access, correction, deletion, and portability rights." },
  { kind: "absent", need: /\b(breach[\s\S]{0,30}(?:notif|inform)|notify[\s\S]{0,30}breach|72 hours)\b/i,
    unless: /\b(personal data|personal information|data subject|gdpr|phi|health information)\b/i,
    title: "No data-breach notification commitment", severity: "high", category: "data_privacy",
    risk: "There is no commitment to notify anyone if personal data is breached.",
    regulation: "GDPR Art. 33 / 34",
    recommendation: "Add a breach-notification timeline (GDPR expects authority notice within 72 hours)." },
  { kind: "absent", need: /\b(business associate|hipaa|minimum necessary|safeguard[\s\S]{0,20}health)\b/i,
    unless: /\b(phi|protected health information|health information|medical record|patient data)\b/i,
    title: "Health data without HIPAA safeguards", severity: "high", category: "data_privacy",
    risk: "The document references health information but does not mention HIPAA safeguards or a Business Associate Agreement.",
    regulation: "HIPAA",
    recommendation: "Add HIPAA-required safeguards, a Business Associate Agreement, and the minimum-necessary standard." },
];

function context(text: string, index: number, len: number): string {
  const start = Math.max(0, index - 60);
  const end = Math.min(text.length, index + len + 60);
  let snippet = text.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  return snippet;
}

function guessType(text: string): string {
  const t = text.toLowerCase();
  if (/privacy policy/.test(t)) return "Privacy Policy";
  if (/terms of (service|use)|terms and conditions/.test(t)) return "Terms of Service";
  if (/employment|employee|salary|job title/.test(t)) return "Employment Contract";
  if (/non-?disclosure|nda/.test(t)) return "Non-Disclosure Agreement";
  if (/lease|tenant|landlord|rent/.test(t)) return "Lease Agreement";
  if (/services?\b[\s\S]{0,40}agreement|statement of work|sow/.test(t)) return "Services Agreement";
  if (/data processing|controller|processor/.test(t)) return "Data Processing Agreement";
  return "Contract / Agreement";
}

export function scanDocument(text: string): ScanResult {
  const findings: Finding[] = [];

  for (const rule of RULES) {
    if (rule.kind === "present") {
      const m = rule.pattern.exec(text);
      if (m) {
        findings.push({
          title: rule.title, severity: rule.severity, category: rule.category,
          quote: context(text, m.index, m[0].length),
          risk: rule.risk, regulation: rule.regulation, recommendation: rule.recommendation,
        });
      }
    } else {
      const gateOk = rule.unless ? rule.unless.test(text) : true;
      if (gateOk && !rule.need.test(text)) {
        findings.push({
          title: rule.title, severity: rule.severity, category: rule.category,
          quote: "Not found anywhere in the document.",
          risk: rule.risk, regulation: rule.regulation, recommendation: rule.recommendation,
        });
      }
    }
  }

  const highs = findings.filter((f) => f.severity === "high").length;
  const overallRisk: ScanResult["overallRisk"] =
    highs >= 2 ? "high" : highs === 1 || findings.length >= 4 ? "medium" : findings.length ? "low" : "low";

  const summary = findings.length
    ? `Scanned for common red flags and found ${findings.length} item${findings.length !== 1 ? "s" : ""} worth a closer look${highs ? `, including ${highs} high-severity` : ""}. Review each below.`
    : "No common red-flag patterns were detected. This does not guarantee the document is safe, only that the usual problem clauses were not found.";

  return { documentType: guessType(text), overallRisk, summary, findings };
}
