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
    const apiBase = "https://olivia-ai.o7digital.com/api";
    const leadEndpoint = "https://formspree.io/f/xyknngqo";
    const chatEndpoint = `${apiBase}/olivia/chat`;
    const identityEndpoint = `${apiBase}/widget/identity`;

    const css = `
#olivia-chat{position:fixed;right:22px;bottom:22px;z-index:2147483646;font-family:Inter,Helvetica Neue,Arial,sans-serif;color:#171717}
#olivia-chat *{box-sizing:border-box}
.olivia-panel{width:min(410px,calc(100vw - 28px));height:min(680px,calc(100dvh - 100px));margin-bottom:14px;display:none;flex-direction:column;overflow:hidden;border:1px solid #d6b264;border-radius:26px;background:#101010;color:#fff;box-shadow:0 46px 78px -28px rgba(0,0,0,.82),0 22px 38px -26px rgba(0,0,0,.7)}
.olivia-panel.is-open{display:flex;animation:olivia-open .28s ease-out}.olivia-header{display:flex;align-items:center;gap:12px;padding:17px 18px;background:radial-gradient(circle at 12% 0,#3a3020,#101010 62%);border-bottom:1px solid rgba(214,178,100,.28)}
.olivia-brand{flex:1}.olivia-title{margin:0;color:#f7edd6;font:700 20px/1.2 Georgia,serif}.olivia-title b{margin-left:5px;padding:2px 6px;border:1px solid rgba(214,178,100,.55);border-radius:999px;color:#d6b264;font:800 9px Inter,Arial,sans-serif;vertical-align:middle}
.olivia-status{display:flex;align-items:center;gap:6px;margin:4px 0 0;color:rgba(255,255,255,.7);font-size:11px}.olivia-status i{width:8px;height:8px;border-radius:50%;background:#39d98a;box-shadow:0 0 9px #39d98a}
.olivia-close,.olivia-toggle,.olivia-teaser,.olivia-lead button,.olivia-composer button{border:0;cursor:pointer;font:inherit}
.olivia-close{width:36px;height:36px;border:1px solid rgba(255,255,255,.12);border-radius:50%;background:rgba(255,255,255,.06);color:#fff;font-size:22px}.olivia-head-avatar,.olivia-avatar{position:relative;display:grid;place-items:center;flex:0 0 auto;border-radius:50%;background:radial-gradient(circle at 35% 25%,#f1dfb4,#d6b264 56%,#92743a);color:#101010;font:700 24px Georgia,serif;box-shadow:inset 0 1px rgba(255,255,255,.7),0 6px 15px rgba(0,0,0,.45)}.olivia-head-avatar{width:46px;height:46px}.olivia-head-avatar i,.olivia-avatar i{position:absolute;right:0;bottom:1px;width:10px;height:10px;border:2px solid #101010;border-radius:50%;background:#39d98a;box-shadow:0 0 8px #39d98a}
.olivia-messages{flex:1;min-height:210px;overflow-y:auto;padding:16px;background:linear-gradient(#faf7f0,#f1ece1);overscroll-behavior:contain;-webkit-overflow-scrolling:touch}.olivia-date{text-align:center;color:#8d887c;font-size:8px;letter-spacing:1.35px;margin:1px 0 14px}
.olivia-message{width:fit-content;max-width:88%;margin:0 0 10px;padding:11px 13px;border-radius:6px 16px 16px;background:#fff;color:#202426;font-size:14px;line-height:1.48;box-shadow:0 7px 20px -15px rgba(0,0,0,.6)}.olivia-message-line{display:block}.olivia-message-space{display:block;height:8px}.olivia-message-bullet{display:flex;gap:8px;margin:5px 0}.olivia-message-bullet>i{color:#aa8748;font-style:normal;font-weight:900}.olivia-message strong{color:#171717}.olivia-message.user{margin-left:auto;border-radius:16px 6px 16px 16px;background:#171717;color:#f7f2e8}.olivia-message.user strong{color:#fff}
.olivia-lead{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:14px 0 4px;padding:15px;border:1px solid #cfb573;border-radius:18px;background:#fff;box-shadow:0 16px 34px -24px #000}.olivia-lead p,.olivia-lead textarea,.olivia-lead button{grid-column:1/-1}.olivia-lead p{margin:0 0 3px;color:#27302f;font-size:12px;line-height:1.4}.olivia-lead p strong{display:block;margin-bottom:3px;font:700 17px Georgia,serif;color:#111}
.olivia-lead input,.olivia-lead textarea,.olivia-composer input{width:100%;min-width:0;border:1px solid #ded8ca;border-radius:11px;background:#faf9f6;color:#171717;font:inherit;font-size:14px;outline:none}.olivia-lead input,.olivia-lead textarea{padding:10px}.olivia-lead textarea{min-height:62px;resize:vertical}.olivia-lead input::placeholder,.olivia-lead textarea::placeholder,.olivia-composer input::placeholder{color:#777}
.olivia-lead button,.olivia-composer button,.olivia-toggle{background:linear-gradient(145deg,#e2c987,#b99248);color:#101010;font-weight:900}.olivia-lead button{padding:11px 14px;border-radius:999px}.olivia-composer{display:grid;grid-template-columns:1fr 44px;gap:8px;padding:12px;background:#101010;border-top:1px solid rgba(255,255,255,.1)}
.olivia-composer input{padding:11px 13px;background:#fff}.olivia-composer button{border-radius:50%;font-size:18px}
.olivia-composer button:disabled,.olivia-lead button:disabled,.olivia-composer input:disabled{opacity:.58;cursor:not-allowed}
.olivia-closed{display:flex;justify-content:flex-end}.olivia-teaser{display:flex;align-items:center;gap:10px;padding:8px 13px 8px 8px;border:1px solid rgba(214,178,100,.65);border-radius:999px;background:#101010;color:#fff;box-shadow:0 22px 46px -17px rgba(0,0,0,.7);animation:olivia-float 5.5s ease-in-out infinite}.olivia-teaser>span:nth-child(2){text-align:left;font-weight:800}.olivia-teaser small{display:block;color:#aaa;font-size:9px;font-weight:400}.olivia-avatar{width:42px;height:42px}.olivia-toggle{display:none}
@keyframes olivia-open{from{opacity:0;transform:translateY(14px) scale(.97)}}@keyframes olivia-float{50%{transform:translateY(-7px)}}
@media (max-width:560px){#olivia-chat{right:max(10px,env(safe-area-inset-right));bottom:max(10px,env(safe-area-inset-bottom));left:max(10px,env(safe-area-inset-left))}.olivia-panel{width:100%;height:min(720px,calc(100dvh - max(20px,env(safe-area-inset-top)) - max(20px,env(safe-area-inset-bottom)));border-radius:24px}.olivia-header{padding:14px 15px}.olivia-lead{grid-template-columns:1fr}.olivia-lead input,.olivia-lead textarea,.olivia-composer input{font-size:16px}.olivia-composer{padding-bottom:max(12px,env(safe-area-inset-bottom))}.olivia-teaser{max-width:100%}}
`;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const copy = {
      es: { title: "Olivia AI", status: "Asesora de belleza Elite 7 Piel", online: "En línea", teaser: "¿Te ayudo a elegir?", open: "Abrir chat", close: "Cerrar chat", welcome: "Hola, soy Olivia AI, asesora digital de ELITE 7 PIEL. Puedo orientarte sobre cuidado facial, capilar, productos, pedidos y envíos. ¿Qué te gustaría mejorar o consultar hoy?", leadTitle: "Sigamos con tu consulta", leadIntro: "Déjanos tus datos para que un asesor prepare un seguimiento personalizado.", firstName: "Nombre", lastName: "Apellido", email: "Email", phone: "Teléfono", reason: "Motivo de tu consulta", submitLead: "Solicitar seguimiento", leadThanks: "Gracias. Un asesor de ELITE 7 PIEL dará seguimiento a tu solicitud.", placeholder: "Escribe tu pregunta...", send: "Enviar", error: "No pude enviar el mensaje. Intenta de nuevo o contacta directamente a ELITE 7 PIEL." },
      en: { title: "Olivia AI", status: "Elite 7 Piel beauty advisor", online: "Online", teaser: "Can I help you choose?", open: "Open chat", close: "Close chat", welcome: "Hello, I am Olivia AI, ELITE 7 PIEL's digital advisor. I can help with facial care, hair care, products, orders and shipping. What would you like to improve or ask today?", leadTitle: "Let's continue your inquiry", leadIntro: "Leave your details so an advisor can prepare a personalized follow-up.", firstName: "First name", lastName: "Last name", email: "Email", phone: "Phone", reason: "Reason for your inquiry", submitLead: "Request follow-up", leadThanks: "Thank you. An ELITE 7 PIEL advisor will follow up on your request.", placeholder: "Write your question...", send: "Send", error: "I could not send the message. Please try again or contact ELITE 7 PIEL directly." },
      fr: { title: "Olivia AI", status: "Conseillère beauté Elite 7 Piel", online: "En ligne", teaser: "Je vous aide à choisir ?", open: "Ouvrir le chat", close: "Fermer le chat", welcome: "Bonjour, je suis Olivia AI, conseillère digitale d'ELITE 7 PIEL. Je peux vous orienter sur les soins du visage, des cheveux, les produits, commandes et livraisons. Que souhaitez-vous améliorer ou demander ?", leadTitle: "Poursuivons votre demande", leadIntro: "Laissez vos coordonnées afin qu'un conseiller prépare un suivi personnalisé.", firstName: "Prénom", lastName: "Nom", email: "Email", phone: "Téléphone", reason: "Motif de votre demande", submitLead: "Demander un suivi", leadThanks: "Merci. Un conseiller ELITE 7 PIEL assurera le suivi de votre demande.", placeholder: "Écrivez votre question...", send: "Envoyer", error: "Je n'ai pas pu envoyer le message. Réessayez ou contactez directement ELITE 7 PIEL." },
    };

    const langTag = (document.documentElement.lang || "").toLowerCase();
    const path = window.location.pathname;
    const lang = langTag.startsWith("fr") || path.startsWith("/fr") ? "fr" : langTag.startsWith("en") || path.startsWith("/en") ? "en" : "es";
    const t = copy[lang];
    let isOpen = false, isLoading = false, leadSent = false, widgetIdentity = "";
    let messages = [{ role: "assistant", content: t.welcome }];
    let lead = { firstName: "", lastName: "", email: "", phone: "", reason: "" };

    const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    const transcript = () => messages.map((m) => `${m.role}: ${m.content}`).join("\n");
    const rich = (value) => esc(value).split("\n").map((line) => {
      const bullet = line.match(/^\s*[-•*]\s+(.+)/);
      const formatted = (bullet ? bullet[1] : line).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*\*/g, "");
      if (bullet) return `<span class="olivia-message-bullet"><i>•</i><span>${formatted}</span></span>`;
      if (!line.trim()) return '<span class="olivia-message-space"></span>';
      return `<span class="olivia-message-line">${formatted}</span>`;
    }).join("");
    const pageMetadata = () => ({ pageUrl: location.href, pageTitle: document.title, pageContent: document.body.innerText.replace(/\s+/g, " ").slice(0, 5000), source: "website" });
    const answerForTurn = (answer, turn) => turn >= 2 ? answer : String(answer).split(/\n\n+/).filter((paragraph) => !/(nombre.*correo.*tel[eé]fono|name.*email.*phone|nom.*email.*t[eé]l[eé]phone|seguimiento personalizado.*comp[aá]rteme)/i.test(paragraph)).join("\n\n").trim();

    const render = () => {
      const userTurns = messages.filter((message) => message.role === "user").length;
      const msgs = messages.map((m) => `<div class="olivia-message ${m.role}">${rich(m.content)}</div>`).join("") + (isLoading ? '<div class="olivia-message assistant">•••</div>' : "");
      const leadForm = userTurns >= 2 && !leadSent && !isLoading ? `<form class="olivia-lead"><p><strong>${esc(t.leadTitle)}</strong>${esc(t.leadIntro)}</p><input required name="firstName" placeholder="${esc(t.firstName)}" value="${esc(lead.firstName)}"/><input required name="lastName" placeholder="${esc(t.lastName)}" value="${esc(lead.lastName)}"/><input required type="email" name="email" placeholder="${esc(t.email)}" value="${esc(lead.email)}"/><input required type="tel" name="phone" placeholder="${esc(t.phone)}" value="${esc(lead.phone)}"/><textarea required name="reason" placeholder="${esc(t.reason)}">${esc(lead.reason)}</textarea><button type="submit">${esc(t.submitLead)} →</button></form>` : "";
      root.innerHTML = `<section class="olivia-panel ${isOpen ? "is-open" : ""}"><header class="olivia-header"><span class="olivia-head-avatar">O<i></i></span><div class="olivia-brand"><p class="olivia-title">${esc(t.title)} <b>v2</b></p><p class="olivia-status"><i></i>${esc(t.status)} · ${esc(t.online)}</p></div><button type="button" class="olivia-close" aria-label="${esc(t.close)}">×</button></header><div class="olivia-messages"><div class="olivia-date">ELITE 7 PIEL · ASESORA DIGITAL</div>${msgs}${leadForm}</div><div class="olivia-composer"><input class="olivia-input" ${!widgetIdentity || isLoading ? "disabled" : ""} placeholder="${esc(t.placeholder)}"/><button type="button" class="olivia-send" ${!widgetIdentity || isLoading ? "disabled" : ""}>➤</button></div></section><div class="olivia-closed">${isOpen ? "" : `<button type="button" class="olivia-teaser"><span class="olivia-avatar">O<i></i></span><span>${esc(t.teaser)}<small>Olivia AI v2 · ${esc(t.online)}</small></span></button>`}</div>`;
      bind();
      const box = root.querySelector(".olivia-messages"); if (box) box.scrollTop = box.scrollHeight;
    };

    const saveLead = () => {
      const f = root.querySelector(".olivia-lead"); if (!f) return;
      lead = { firstName: f.firstName?.value || "", lastName: f.lastName?.value || "", email: f.email?.value || "", phone: f.phone?.value || "", reason: f.reason?.value || "" };
    };

    const submitLead = async (e) => {
      e.preventDefault(); if (isLoading) return; saveLead();
      if (!lead.firstName.trim() || !lead.lastName.trim() || !lead.email.trim() || !lead.phone.trim() || !lead.reason.trim()) return;
      isLoading = true; render();
      try {
        const r = await fetch(leadEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ ...lead, name: `${lead.firstName} ${lead.lastName}`, source: "Chat Olivia AI v2 Elite 7 Piel", language: lang, siteCode, subject: "Nuevo contacto Olivia AI · Elite 7 Piel", message: `${lead.reason}\n\nConversación:\n${transcript()}` }) });
        if (!r.ok) throw new Error("lead");
        leadSent = true; messages.push({ role: "assistant", content: t.leadThanks });
      } catch { messages.push({ role: "assistant", content: t.error }); }
      isLoading = false; render();
    };

    const sendMessage = async () => {
      const i = root.querySelector(".olivia-input"); const message = i?.value?.trim() || "";
      if (!message || isLoading || !widgetIdentity) return;
      messages.push({ role: "user", content: message }); isLoading = true; render();
      try {
        const r = await fetch(chatEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "X-Olivia-Widget-Identity": widgetIdentity }, body: JSON.stringify({ message, language: lang, clientCode: siteCode, clientId: siteCode, metadata: pageMetadata(), history: messages.slice(-12) }) });
        const d = await r.json();
        const turn = messages.filter((item) => item.role === "user").length;
        messages.push({ role: "assistant", content: answerForTurn(d.reply || t.error, turn) || t.error });
      } catch { messages.push({ role: "assistant", content: t.error }); }
      isLoading = false; render();
    };

    const bind = () => {
      root.querySelector(".olivia-teaser")?.addEventListener("click", () => { isOpen = true; render(); });
      root.querySelector(".olivia-close")?.addEventListener("click", () => { isOpen = false; render(); });
      root.querySelector(".olivia-lead")?.addEventListener("submit", submitLead);
      root.querySelectorAll(".olivia-lead input,.olivia-lead textarea").forEach((el) => el.addEventListener("input", saveLead));
      root.querySelector(".olivia-send")?.addEventListener("click", sendMessage);
      root.querySelector(".olivia-input")?.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
    };

    render();
    fetch(identityEndpoint, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("identity")))
      .then((data) => {
        if (data.clientCode !== siteCode || !data.identity) throw new Error("identity");
        widgetIdentity = data.identity;
        render();
      })
      .catch(() => {
        messages = [{ role: "assistant", content: t.error }];
        render();
      });

    return () => {
      style.remove();
      root?.remove();
    };
  }, []);

  return null;
}
