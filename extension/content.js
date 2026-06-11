// Runs automatically on each broker opt-out page.
// 1) reads your locally-stored profile, 2) fills matching fields,
// 3) detects CAPTCHA / verification, 4) auto-submits only when safe.
(function () {
  if (window.__erasaRan) return;
  window.__erasaRan = true;

  chrome.storage.local.get(["erasa_profile"], ({ erasa_profile }) => {
    if (!erasa_profile || !erasa_profile.firstName) return;
    // Let the page settle (many forms render late), then act.
    setTimeout(() => fillAndGuide(erasa_profile), 1200);
  });

  // React/Vue friendly value setter so frameworks register the change.
  function setValue(el, val) {
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement : el.tagName === "SELECT" ? HTMLSelectElement : HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(proto.prototype, "value")?.set;
    if (setter) setter.call(el, val); else el.value = val;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function labelText(el) {
    let t = "";
    if (el.labels && el.labels[0]) t += " " + el.labels[0].textContent;
    if (el.getAttribute("aria-label")) t += " " + el.getAttribute("aria-label");
    if (el.placeholder) t += " " + el.placeholder;
    if (el.name) t += " " + el.name;
    if (el.id) t += " " + el.id;
    const wrapLabel = el.closest("label");
    if (wrapLabel) t += " " + wrapLabel.textContent;
    return t.toLowerCase();
  }

  function pick(p, hint) {
    if (/first.?name|given|fname/.test(hint)) return p.firstName;
    if (/last.?name|surname|family|lname/.test(hint)) return p.lastName;
    if (/e.?mail/.test(hint)) return p.email;
    if (/phone|tel|mobile/.test(hint)) return p.phone;
    if (/zip|postal/.test(hint)) return p.zip;
    if (/state|province|region/.test(hint)) return p.state;
    if (/city|town/.test(hint)) return p.city;
    if (/street|address|addr|line.?1/.test(hint)) return p.address;
    if (/full.?name|your.?name|name/.test(hint) && !/user|company|business|file/.test(hint)) return p.fullName;
    return null;
  }

  function fillAndGuide(p) {
    let filled = 0;
    const els = document.querySelectorAll("input, textarea, select");
    els.forEach((el) => {
      const type = (el.type || "").toLowerCase();
      if (["password", "hidden", "submit", "button", "file", "checkbox", "radio"].includes(type)) return;
      if (el.disabled || el.readOnly) return;
      const hint = labelText(el);
      const val = pick(p, hint);
      if (!val) return;
      if (el.tagName === "SELECT") {
        const opt = [...el.options].find((o) => o.value.toLowerCase() === val.toLowerCase() || o.textContent.trim().toLowerCase() === val.toLowerCase());
        if (opt) { el.value = opt.value; el.dispatchEvent(new Event("change", { bubbles: true })); filled++; }
      } else if (!el.value) {
        setValue(el, val); filled++;
      }
    });

    const captcha = !!document.querySelector('iframe[src*="recaptcha"],iframe[src*="hcaptcha"],iframe[src*="turnstile"],.g-recaptcha,.h-captcha,#captcha,[class*="captcha" i]');
    const submit = findSubmit();
    banner(filled, captcha, submit, p);
  }

  function findSubmit() {
    const direct = document.querySelector('button[type="submit"], input[type="submit"]');
    if (direct) return direct;
    const btns = [...document.querySelectorAll("button, input[type=button], a.button, .btn")];
    return btns.find((b) => /opt.?out|remove|submit|continue|next|delete|suppress|request/i.test((b.textContent || b.value || ""))) || null;
  }

  function banner(filled, captcha, submit, p) {
    document.getElementById("erasa-bar")?.remove();
    const bar = document.createElement("div");
    bar.id = "erasa-bar";
    bar.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#12151A;color:#FAF8F2;font:600 13px system-ui,sans-serif;padding:10px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 2px 14px rgba(0,0,0,.4)";
    const msg = document.createElement("span");
    msg.style.flex = "1";
    bar.appendChild(msg);
    document.documentElement.appendChild(bar);

    const canAuto = p.autosubmit && !captcha && submit;
    if (captcha) {
      msg.innerHTML = `<b style="color:#FF5A1F">Erasa:</b> ${filled} fields filled. Solve the CAPTCHA, then submit this opt-out.`;
      addClose(bar);
    } else if (canAuto) {
      let n = 5;
      msg.innerHTML = `<b style="color:#1E7A4C">Erasa:</b> ${filled} fields filled. Auto-submitting in <b id="erasa-n">5</b>s.`;
      const cancel = document.createElement("button");
      cancel.textContent = "Cancel";
      style(cancel, "#FF5A1F");
      bar.appendChild(cancel);
      let cancelled = false;
      cancel.onclick = () => { cancelled = true; clearInterval(t); msg.innerHTML = `<b style="color:#FF5A1F">Erasa:</b> auto-submit cancelled. Review and submit yourself.`; cancel.remove(); addClose(bar); };
      const t = setInterval(() => {
        if (cancelled) return;
        n--; const nx = document.getElementById("erasa-n"); if (nx) nx.textContent = n;
        if (n <= 0) { clearInterval(t); if (!cancelled) { msg.innerHTML = `<b style="color:#1E7A4C">Erasa:</b> submitting…`; submit.click(); } }
      }, 1000);
    } else if (submit) {
      msg.innerHTML = `<b style="color:#FF5A1F">Erasa:</b> ${filled} fields filled. Review and click submit to send your opt-out.`;
      const go = document.createElement("button");
      go.textContent = "Submit now"; style(go, "#1E7A4C");
      go.onclick = () => submit.click();
      bar.appendChild(go); addClose(bar);
    } else {
      msg.innerHTML = `<b style="color:#FF5A1F">Erasa:</b> ${filled} fields filled. This page may need you to search your listing first, then opt out.`;
      addClose(bar);
    }
    document.body && (document.body.style.marginTop = "44px");
  }

  function style(b, bg) { b.style.cssText = `font:700 12px system-ui;padding:7px 14px;border:none;background:${bg};color:#fff;cursor:pointer`; }
  function addClose(bar) {
    const x = document.createElement("button");
    x.textContent = "Dismiss"; style(x, "transparent"); x.style.border = "1px solid #555";
    x.onclick = () => { bar.remove(); if (document.body) document.body.style.marginTop = ""; };
    bar.appendChild(x);
  }
})();
