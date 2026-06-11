const FIELDS = ["firstName", "lastName", "email", "phone", "city", "state", "zip", "address"];
const $ = (id) => document.getElementById(id);

// Render broker checklist (all checked by default).
const list = $("brokers");
self.ERASA_BROKERS.forEach((b) => {
  const l = document.createElement("label");
  l.innerHTML = `<input type="checkbox" data-slug="${b.slug}" checked> ${b.name}`;
  list.appendChild(l);
});
$("count").textContent = `${self.ERASA_BROKERS.length} brokers selected`;
list.addEventListener("change", () => {
  const n = list.querySelectorAll("input:checked").length;
  $("count").textContent = `${n} broker${n === 1 ? "" : "s"} selected`;
});

// Load any saved profile.
chrome.storage.local.get(["erasa_profile"], ({ erasa_profile }) => {
  if (!erasa_profile) return;
  FIELDS.forEach((f) => { if (erasa_profile[f]) $(f).value = erasa_profile[f]; });
  if (typeof erasa_profile.autosubmit === "boolean") $("autosubmit").checked = erasa_profile.autosubmit;
});

function readProfile() {
  const p = { autosubmit: $("autosubmit").checked };
  FIELDS.forEach((f) => { p[f] = $(f).value.trim(); });
  p.fullName = `${p.firstName} ${p.lastName}`.trim();
  return p;
}

function saveProfile() {
  return new Promise((res) => chrome.storage.local.set({ erasa_profile: readProfile() }, res));
}

$("save").addEventListener("click", async () => {
  await saveProfile();
  $("note").innerHTML = '<span class="ok">Saved.</span> Your details are stored locally in this browser only.';
});

$("start").addEventListener("click", async () => {
  const p = readProfile();
  if (!p.firstName || !p.lastName) { $("note").textContent = "Enter at least your first and last name first."; return; }
  await saveProfile();
  const slugs = [...list.querySelectorAll("input:checked")].map((c) => c.dataset.slug);
  const items = self.ERASA_BROKERS.filter((b) => slugs.includes(b.slug));
  chrome.runtime.sendMessage({ type: "erasa-start", items, profile: p });
  $("note").innerHTML = `<span class="ok">Started.</span> Opening ${items.length} brokers and filling your details. Watch the tabs, solve any CAPTCHA, then submit.`;
});
