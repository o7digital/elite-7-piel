"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { CLIENT_FIELDS, validateClient } from "@/lib/admin-clients.mjs";
import { normalizeSearch } from "@/lib/specials-filters.mjs";
import styles from "./SpecialsAdmin.module.css";
const LABELS = { firstName: "Nombre", lastName: "Apellidos", email: "Correo electrónico", phone: "Teléfono", company: "Empresa", taxId: "RFC", address: "Dirección", city: "Ciudad", state: "Estado", postalCode: "Código postal", country: "País", notes: "Notas internas" };
function ClientEditor({ client, saving, onSave, onClose }) {
  const ref = useRef(null);
  const [values, setValues] = useState(client);
  const [error, setError] = useState("");
  useEffect(() => { ref.current.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, []);
  return <dialog ref={ref} className={`${styles.dialog} ${styles.dialogWide}`} aria-label={client.id ? "Editar cliente" : "Nuevo cliente"} onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }}>
    <div className={styles.dialogHeading}><h2>{client.id ? "Editar cliente" : "Nuevo cliente"}</h2><button type="button" className={styles.iconButton} aria-label="Cerrar cliente" disabled={saving} onClick={onClose}>×</button></div>
    <form onSubmit={async (event) => { event.preventDefault(); setError(""); try { await onSave(client, validateClient(values)); } catch (failure) { setError(failure.message); } }}>
      <div className={styles.editorBody}><p className={styles.muted}>Ficha privada en WP2. No crea una cuenta de tienda ni envía correos.</p>
        <div className={styles.formGrid}>{CLIENT_FIELDS.filter((key) => key !== "notes").map((key) => <label key={key}>{LABELS[key]}<input type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} value={values[key] || ""} maxLength="500" onChange={(event) => setValues((previous) => ({ ...previous, [key]: event.target.value }))} /></label>)}</div>
        <label>Notas internas<textarea value={values.notes || ""} rows="4" maxLength="2000" onChange={(event) => setValues((previous) => ({ ...previous, notes: event.target.value }))} /></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div><footer className={styles.dialogFooter}><button type="button" className={styles.secondary} disabled={saving} onClick={onClose}>Cancelar</button><button className={styles.primary} disabled={saving}>{saving ? "Guardando…" : "Guardar cliente en WP2"}</button></footer>
    </form>
  </dialog>;
}
export default function ClientsPanel({ connected, request, onConnect }) {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editor, setEditor] = useState(null);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let active = true;
    if (!connected) { setClients([]); setError(""); return; }
    setLoading(true); setError("");
    request().then((data) => { if (active) setClients(data.clients); }).catch((failure) => { if (active) setError(failure.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [connected]);
  const refresh = async () => { setLoading(true); setError(""); try { const data = await request(); setClients(data.clients); } catch (failure) { setError(failure.message); } finally { setLoading(false); } };
  const results = useMemo(() => {
    const words = normalizeSearch(search).split(/\s+/).filter(Boolean);
    return clients.filter((client) => { const text = normalizeSearch(CLIENT_FIELDS.map((key) => client[key]).join(" ")); return words.every((word) => text.includes(word)); });
  }, [clients, search]);
  const pageCount = Math.max(1, Math.ceil(results.length / 25));
  const currentPage = Math.min(page, pageCount);
  const visible = results.slice((currentPage - 1) * 25, currentPage * 25);
  const save = async (client, data) => {
    setSaving(true);
    try {
      const response = await request({ method: "POST", body: JSON.stringify({ ...(client.id ? { id: client.id, expectedUpdatedAt: client.updatedAt || "" } : {}), client: data }) });
      setClients((previous) => (client.id ? previous.map((item) => item.id === response.client.id ? response.client : item) : [response.client, ...previous])); setEditor(null); setMessage("Ficha del cliente guardada en WP2.");
    } finally { setSaving(false); }
  };
  return <section className={styles.clientsPanel} aria-label="Base de clientes">
    <div className={styles.clientsHeading}><div><h2>Clientes Especiales</h2><p>{connected ? `${clients.length} fichas privadas en WP2` : "Conecta WP2 para acceder a la base de clientes."}</p></div><div><button className={styles.secondary} disabled={!connected || loading} onClick={refresh}>{loading ? "Cargando…" : "Actualizar clientes"}</button><button className={styles.primary} disabled={!connected || loading || !!error} onClick={() => setEditor({ ...Object.fromEntries(CLIENT_FIELDS.map((key) => [key, ""])), country: "MX" })}>Nuevo cliente</button></div></div>
    {!connected && <div className={styles.info}><button onClick={onConnect}>Conectar WP2</button> para consultar y editar los clientes. No se muestran datos personales sin autenticación.</div>}
    <div className={styles.info}>El módulo WordPress habilita los campos de Especiales y el archivo privado de clientes. <a href="/admin/elite7-wp2-admin.zip" download>Descargar módulo WP2</a>.</div>
    {error && <p className={styles.error} role="alert">{error}</p>}{message && <p className={styles.success} role="status">{message}</p>}
    {connected && !error && <><label className={styles.clientSearch}>Buscar cliente<input type="search" value={search} placeholder="Nombre, correo, teléfono, empresa o RFC…" onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></label>
      <div className={styles.clientList}>{visible.map((client) => <article key={client.id} className={styles.clientCard}><div><h3>{[client.firstName, client.lastName].filter(Boolean).join(" ") || client.company}</h3><p>{client.email || "Sin correo"} · {client.phone || "Sin teléfono"}</p><small>{[client.company, client.taxId, client.city, client.state].filter(Boolean).join(" · ") || "Sin datos adicionales"}</small></div><button className={styles.secondary} onClick={() => setEditor(client)} aria-label={`Editar cliente ${client.firstName || client.company}`}>Editar</button></article>)}</div>
      {!loading && !results.length && <div className={styles.empty}><h2>{clients.length ? "No hay clientes con esta búsqueda." : "Todavía no hay clientes registrados."}</h2></div>}
      <footer className={styles.pagination}><span>{results.length} clientes encontrados</span><div><button aria-label="Clientes anteriores" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>←</button><b>{currentPage} / {pageCount}</b><button aria-label="Clientes siguientes" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>→</button></div></footer></>}
    {editor && <ClientEditor client={editor} saving={saving} onSave={save} onClose={() => setEditor(null)} />}
  </section>;
}
