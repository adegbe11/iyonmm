// Orchestrates the run: opens each broker opt-out page in a background tab,
// throttled so the browser is not flooded. The content script does the filling.
// For email-only brokers, opens a pre-filled mailto in the user's mail client.

const DELAY_MS = 1500;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function deletionLetter(name, email, brokerName) {
  return `To the Privacy / Data Protection Team at ${brokerName},

I am exercising my right to deletion under applicable privacy law (CCPA / CPRA, GDPR Art. 17, or equivalent). Please permanently delete all personal information you hold, display, sell, or share concerning me, and add me to your suppression list.

Name: ${name}
Email: ${email}

Please confirm in writing that my records have been deleted and the date of deletion.

Regards,
${name}`;
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "erasa-start") return;
  run(msg.items, msg.profile);
});

async function run(items, profile) {
  for (const b of items) {
    try {
      if (b.method === "email" || !b.url) {
        const subject = encodeURIComponent(`Formal Data Deletion Request, ${profile.fullName}`);
        const body = encodeURIComponent(deletionLetter(profile.fullName, profile.email || "", b.name));
        await chrome.tabs.create({ url: `mailto:${b.email}?subject=${subject}&body=${body}`, active: false });
      } else {
        await chrome.tabs.create({ url: b.url, active: false });
      }
    } catch (e) { /* keep going */ }
    await sleep(DELAY_MS);
  }
}
