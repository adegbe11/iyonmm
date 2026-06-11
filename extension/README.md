# Erasa Data Removal Assistant (browser extension)

Automatically opens every data broker opt-out page, fills in your details, and
submits where it is safe. **Your details never leave your browser** — they are
stored only in the extension's local storage and used to fill forms on your own
machine. There is no server and no upload.

## Install (Chrome / Edge / Brave, developer mode)

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this `extension/` folder.
4. Pin the Erasa icon, click it, fill in your details once, click **Save details**.
5. Click **Start removal**.

## What it does automatically

- Opens each selected broker's opt-out page in a background tab (throttled).
- Fills first/last name, email, phone, address, city, state, ZIP using robust
  field-matching that works across most form layouts.
- Detects CAPTCHAs and "verify your email" steps.
- **Auto-submits** a form only when no CAPTCHA is detected and you left
  "Auto-submit" on, after a 5-second cancelable countdown.
- For brokers that only take email (e.g. National Public Data), it opens a
  pre-filled deletion email in your mail client.

## What it cannot do (honest limits)

- It cannot solve CAPTCHAs or click the confirmation link in your inbox. Those
  exist specifically to stop automation. When it hits one, it fills everything
  and pauses for your single click. This is unavoidable for any tool that does
  not upload your data to a server.
- Some brokers require you to **search and pick your listing** before the opt-out
  form appears. On those, the extension fills what it can and tells you.
- Broker pages change. If a field is missed, fill it manually; the page still
  works.

## Privacy

`permissions`: `storage` (save your details locally), `tabs` (open opt-out
pages), `scripting`/host permissions (fill forms on broker sites only). No
analytics, no network calls with your data. Review `content.js` and
`background.js` — there is no `fetch` of your personal data anywhere.
