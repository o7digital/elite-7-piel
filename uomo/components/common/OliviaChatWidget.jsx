"use client";

import { useEffect } from "react";

export default function OliviaChatWidget() {
  useEffect(() => {
    const rootId = "olivia-chat";
    let root = document.getElementById(rootId);
    if (!root) {
      root = document.createElement("div");
      root.id = rootId;
      document.body.appendChild(root);
    }
    if (root.dataset.ready === "true") return;
    root.dataset.ready = "true";

    const siteCode = "elite7piel";
    const offline = true;
    const leadEndpoint = "https://www.o7digital.com/api/o7-lead";
    const chatEndpoint = "https://www.o7digital.com/api/o7-chat";

    const css = `
#olivia-chat{position:fixed;right:22px;bottom:22px;z-index:2147483646;font-family:Inter,Helvetica Neue,Arial,sans-serif}
#olivia-chat *{box-sizing:border-box}
.olivia-panel{width:min(400px,calc(100vw - 28px));height:min(660px,calc(100vh - 110px));margin-bottom:14px;display:none;flex-direction:column;overflow:hidden;border:1px solid rgba(214,178,100,.42);border-radius:18px;background:#090909;color:#fff;box-shadow:0 28px 90px rgba(0,0,0,.58)}
.olivia-panel.is-open{display:flex}.olivia-header{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px;background:linear-gradient(135deg,rgba(214,178,100,.24),rgba(255,255,255,.07)),#111;border-bottom:1px solid rgba(214,178,100,.34)}
.olivia-title{margin:0;color:#d6b264;font-size:18px;font-weight:900;line-height:1.2;text-transform:uppercase;letter-spacing:.04em}
.olivia-status{margin:4px 0 0;color:rgba(255,255,255,.68);font-size:13px}
.olivia-close,.olivia-toggle,.olivia-teaser,.olivia-lead button,.olivia-composer button{border:0;cursor:pointer;font:inherit}
.olivia-close{width:38px;height:38px;border-radius:12px;background:rgba(214,178,100,.24);color:#fff;font-weight:900}
.olivia-messages{flex:1;min-height:180px;overflow-y:auto;padding:16px;background:linear-gradient(rgba(214,178,100,.06) 1px,transparent 1px),#0d0d0d;background-size:100% 42px}
.olivia-message{width:fit-content;max-width:88%;margin:0 0 10px;padding:11px 13px;border-radius:16px;font-size:14px;line-height:1.45;white-space:pre-wrap}
.olivia-message.assistant{background:rgba(255,255,255,.09);color:#f7f2e8}.olivia-message.user{margin-left:auto;background:#d6b264;color:#080808}
.olivia-lead{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:14px;background:#111;border-top:1px solid rgba(255,255,255,.1)}
.olivia-lead p,.olivia-lead button{grid-column:1 / -1}.olivia-lead p{margin:0;color:rgba(255,255,255,.72);font-size:13px;line-height:1.4}
.olivia-lead input,.olivia-composer input{width:100%;min-width:0;border:1px solid rgba(214,178,100,.28);border-radius:12px;background:rgba(255,255,255,.08);color:#fff;font:inherit;font-size:14px;outline:none}
.olivia-lead input{padding:11px}.olivia-lead input::placeholder,.olivia-composer input::placeholder{color:rgba(255,255,255,.55)}
.olivia-lead button,.olivia-composer button,.olivia-toggle{background:#d6b264;color:#080808;font-weight:900}
.olivia-lead button{padding:12px 14px;border-radius:12px}.olivia-composer{display:grid;grid-template-columns:1fr 52px;gap:9px;padding:14px;background:#090909;border-top:1px solid rgba(255,255,255,.1)}
.olivia-composer input{padding:12px 13px}.olivia-composer button{border-radius:12px;font-size:20px}
.olivia-composer button:disabled,.olivia-lead button:disabled,.olivia-composer input:disabled{opacity:.58;cursor:not-allowed}
.olivia-closed{display:flex;flex-direction:column;align-items:flex-end;gap:10px}.olivia-teaser{display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid rgba(214,178,100,.42);border-radius:999px;background:#0b0b0b;color:#fff;box-shadow:0 18px 42px rgba(0,0,0,.36)}
.olivia-avatar{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#d6b264;color:#080808;font-weight:900}.olivia-toggle{min-width:68px;height:68px;padding:0 14px;border-radius:999px;box-shadow:0 16px 44px rgba(0,0,0,.42)}
@media (max-width:560px){#olivia-chat{right:14px;bottom:14px}.olivia-lead{grid-template-columns:1fr}}
`;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const copy = {
      es: { title: "Olivia", status: "Asistente Elite 7 Piel", online: "En linea", teaser: "Necesitas ayuda?", open: "Abrir chat", close: "Cerrar chat", welcome: "Hola, soy Olivia. En que puedo ayudarte hoy?", leadIntro: "Deja tus datos para que un asesor de Elite 7 Piel pueda contactarte.", firstName: "Nombre", lastName: "Apellido", email: "Email", phone: "Telefono", submitLead: "Enviar datos", leadThanks: "Gracias. Tus datos fueron enviados y un asesor te contactara pronto.", placeholder: "Escribe tu pregunta...", send: "Enviar", error: "No pude enviar el mensaje. Intenta de nuevo o contacta directamente a Elite 7 Piel." },
      en: { title: "Olivia", status: "Elite 7 Piel Assistant", online: "Online", teaser: "Need help?", open: "Open chat", close: "Close chat", welcome: "Hello, I am Olivia. How can I help you today?", leadIntro: "Leave your details so an Elite 7 Piel advisor can contact you.", firstName: "First name", lastName: "Last name", email: "Email", phone: "Phone", submitLead: "Send details", leadThanks: "Thanks. Your details were sent and an advisor will contact you soon.", placeholder: "Write your question...", send: "Send", error: "I could not send the message. Please try again or contact Elite 7 Piel directly." },
      fr: { title: "Olivia", status: "Assistante Elite 7 Piel", online: "En ligne", teaser: "Besoin d aide ?", open: "Ouvrir le chat", close: "Fermer le chat", welcome: "Bonjour, je suis Olivia. Comment puis-je vous aider aujourd hui ?", leadIntro: "Laissez vos coordonnees pour qu un conseiller Elite 7 Piel puisse vous contacter.", firstName: "Prenom", lastName: "Nom", email: "Email", phone: "Telephone", submitLead: "Envoyer", leadThanks: "Merci. Vos coordonnees ont ete envoyees et un conseiller vous contactera rapidement.", placeholder: "Ecrivez votre question...", send: "Envoyer", error: "Je n ai pas pu envoyer le message. Reessayez ou contactez directement Elite 7 Piel." },
    };

    const langTag = (document.documentElement.lang || "").toLowerCase();
    const path = window.location.pathname;
    const lang = langTag.startsWith("fr") || path.startsWith("/fr") ? "fr" : langTag.startsWith("en") || path.startsWith("/en") ? "en" : "es";
    const t = copy[lang];
    let isOpen = false, isLoading = false, leadSent = false;
    let messages = offline
      ? [{ role: "assistant", content: "Offline" }, { role: "assistant", content: "Add more credit" }]
      : [{ role: "assistant", content: t.welcome }];
    let lead = { firstName: "", lastName: "", email: "", phone: "" };

    const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    const transcript = () => messages.map((m) => `${m.role}: ${m.content}`).join("\n");

    const render = () => {
      const msgs = messages.map((m) => `<div class="olivia-message ${m.role}">${esc(m.content)}</div>`).join("") + (isLoading ? '<div class="olivia-message assistant">...</div>' : "");
      root.innerHTML = `<section class="olivia-panel ${isOpen ? "is-open" : ""}"><header class="olivia-header"><div><p class="olivia-title">${esc(t.title)}</p><p class="olivia-status">${offline ? "Offline · Add more credit" : `${esc(t.status)} · ${esc(t.online)}`}</p></div><button type="button" class="olivia-close">x</button></header><div class="olivia-messages">${msgs}</div>${offline || leadSent ? "" : `<form class="olivia-lead"><p>${esc(t.leadIntro)}</p><input required name="firstName" placeholder="${esc(t.firstName)}" value="${esc(lead.firstName)}"/><input required name="lastName" placeholder="${esc(t.lastName)}" value="${esc(lead.lastName)}"/><input required type="email" name="email" placeholder="${esc(t.email)}" value="${esc(lead.email)}"/><input required type="tel" name="phone" placeholder="${esc(t.phone)}" value="${esc(lead.phone)}"/><button type="submit" ${isLoading ? "disabled" : ""}>${esc(t.submitLead)}</button></form>`}<div class="olivia-composer"><input class="olivia-input" disabled placeholder="${offline ? "Offline — Add more credit" : esc(t.placeholder)}"/><button type="button" class="olivia-send" disabled>&gt;</button></div></section><div class="olivia-closed">${isOpen ? "" : `<button type="button" class="olivia-teaser"><span class="olivia-avatar">O</span><span>${offline ? "Offline — Add more credit" : esc(t.teaser)}</span></button>`}<button type="button" class="olivia-toggle">${isOpen ? "x" : "Olivia"}</button></div>`;
      bind();
      const box = root.querySelector(".olivia-messages"); if (box) box.scrollTop = box.scrollHeight;
    };

    const saveLead = () => {
      const f = root.querySelector(".olivia-lead"); if (!f) return;
      lead = { firstName: f.firstName?.value || "", lastName: f.lastName?.value || "", email: f.email?.value || "", phone: f.phone?.value || "" };
    };

    const submitLead = async (e) => {
      e.preventDefault(); if (offline || isLoading) return; saveLead();
      if (!lead.firstName.trim() || !lead.lastName.trim() || !lead.email.trim() || !lead.phone.trim()) return;
      isLoading = true; render();
      try {
        const r = await fetch(leadEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...lead, source: "Chat Olivia Elite 7 Piel", language: lang, siteCode, message: `Lead Chat Olivia Elite 7 Piel (${lang}, ${siteCode})\n\n${transcript()}` }) });
        if (!r.ok) throw new Error("lead");
        leadSent = true; messages.push({ role: "assistant", content: t.leadThanks });
      } catch { messages.push({ role: "assistant", content: t.error }); }
      isLoading = false; render();
    };

    const sendMessage = async () => {
      if (offline) return;
      const i = root.querySelector(".olivia-input"); const message = i?.value?.trim() || "";
      if (!message || isLoading || !leadSent) return;
      messages.push({ role: "user", content: message }); isLoading = true; render();
      try {
        const r = await fetch(chatEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, language: lang, siteCode }) });
        const d = await r.json(); messages.push({ role: "assistant", content: d.reply || t.error });
      } catch { messages.push({ role: "assistant", content: t.error }); }
      isLoading = false; render();
    };

    const bind = () => {
      root.querySelector(".olivia-toggle")?.addEventListener("click", () => { isOpen = !isOpen; render(); });
      root.querySelector(".olivia-teaser")?.addEventListener("click", () => { isOpen = true; render(); });
      root.querySelector(".olivia-close")?.addEventListener("click", () => { isOpen = false; render(); });
      root.querySelector(".olivia-lead")?.addEventListener("submit", submitLead);
      root.querySelectorAll(".olivia-lead input").forEach((el) => el.addEventListener("input", saveLead));
      root.querySelector(".olivia-send")?.addEventListener("click", sendMessage);
      root.querySelector(".olivia-input")?.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
    };

    render();
  }, []);

  return null;
}
