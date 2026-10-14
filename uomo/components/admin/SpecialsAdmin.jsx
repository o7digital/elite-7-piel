"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createAdminProduct, calculateEconomics, productNeedsReview, filterAdminProducts, validateDraft, serializeCsv, readImport } from "@/lib/admin-specials.mjs";
import { getSpecialsOptions } from "@/lib/specials-filters.mjs";
import { SECONDARY_WORDPRESS_URL } from "@/lib/wordpress-config.mjs";
import styles from "./SpecialsAdmin.module.css";
import ClientsPanel from "./ClientsPanel";

const EMPTY_FILTERS = { search: "", category: "", brand: "", shipping: "", margin: "", sort: "name", tab: "all" };
const SECTIONS = [{ id: "overview", label: "Resumen", icon: "grid" }, { id: "products", label: "Productos", icon: "box" }, { id: "shipping", label: "Expediciones", icon: "truck" }, { id: "margins", label: "Costos y márgenes", icon: "chart" }, { id: "clients", label: "Clientes", icon: "grid" }, { id: "connections", label: "Conexiones", icon: "link" }];
const money = (value) => value === null || !Number.isFinite(Number(value)) ? "—" : new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 }).format(value);
const percent = (value) => value === null || !Number.isFinite(value) ? "—" : `${value.toFixed(1)}%`;

function Icon({ name, size = 20 }) {
  const paths = { grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z", box: "m12 3 9 5v9l-9 5-9-5V8z M3 8l9 5 9-5 M12 13v9 M7 5l9 5", truck: "M3 5h12v12H3z M15 10h4l3 4v3h-7 M7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4 M18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4", chart: "M4 3v18h18 M9 17v-5 M14 17V8 M19 17V4", link: "m10 14 4-4 M8 16l-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0 M16 8l2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0", edit: "m15 5 4 4 M3 21l4-1L20 7a3 3 0 0 0-4-4L3 16z", download: "M12 3v12 m-5-5 5 5 5-5 M4 17v4h16v-4", menu: "M3 6h18 M3 12h18 M3 18h18", close: "m6 6 12 12 M6 18 18 6", search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14 M15 15l6 6" };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.box} /></svg>;
}

function Dialog({ title, onClose, children, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={ref} className={`${styles.dialog} ${wide ? styles.dialogWide : ""}`} aria-label={title} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === ref.current) { const rect = ref.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <div className={styles.dialogHeading}><h2>{title}</h2><button type="button" onClick={onClose} className={styles.iconButton} aria-label="Cerrar"><Icon name="close" /></button></div>
    {children}
  </dialog>;
}

function ProductIdentity({ product }) {
  return <div className={styles.productIdentity}>
    {product.imgSrc ? <img src={product.imgSrc} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} /> : <span className={styles.imagePlaceholder}><Icon name="box" /></span>}
    <div><strong>{product.title}</strong><span>{product.brands.join(" · ") || "Sin marca especificada"} · #{product.id.slice(7)}</span><small>{product.category}</small></div>
  </div>;
}

function Editor({ product, connected, onSave, onClose, saving }) {
  const [values, setValues] = useState(product);
  const [error, setError] = useState("");
  const [publishPrice, setPublishPrice] = useState(false);
  const economics = calculateEconomics(values);
  const update = (key, value) => setValues((previous) => ({ ...previous, [key]: value }));
  const fields = [{ key: "purchasePrice", label: "Precio de compra (MXN)", hint: "Costo del proveedor", nullable: true }, { key: "salePrice", label: "Precio de venta (MXN)" }, { key: "packagingCost", label: "Empaque (MXN)" }, { key: "feePercent", label: "Comisión de pago (%)", max: "99.99" }, { key: "targetMargin", label: "Margen objetivo (%)", max: "99.99" }, { key: "stock", label: "Stock de referencia", nullable: true, step: "1" }];
  const submit = async (event) => {
    event.preventDefault(); setError("");
    try { const draft = validateDraft(values); await onSave(product, draft, publishPrice); }
    catch (failure) { setError(failure.message); }
  };
  return <Dialog title="Editar producto" onClose={saving ? () => {} : onClose} wide>
    <form onSubmit={submit}>
      <div className={styles.editorBody}>
        <ProductIdentity product={product} />
        <p className={styles.muted}>Precio actual en la tienda: <strong>{money(product.price)}</strong> MXN</p>
        {!connected && <div className={styles.info}>Conecta WP2 para guardar. Puedes explorar el cálculo sin modificar la tienda.</div>}
        <h3>Fabricante y distribuidor</h3>
        <div className={styles.formGrid}><label>Fabricante<input value={values.manufacturer} onChange={(event) => update("manufacturer", event.target.value)} maxLength="200" placeholder="Nombre del fabricante" /></label><label>Distribuidor<input value={values.distributor} onChange={(event) => update("distributor", event.target.value)} maxLength="200" placeholder="Nombre del distribuidor" /></label></div>
        <p className={styles.muted}>Categoría: {product.categories.join(" · ")}. Se conserva la categoría de WooCommerce.</p>
        <h3>Precios y rentabilidad</h3>
        <div className={styles.formGrid}>{fields.map((field) => <label key={field.key}>{field.label}<input type="number" min="0" max={field.max} step={field.step || ".01"} inputMode="decimal" required={!field.nullable} placeholder={field.hint || "Por definir"} value={values[field.key] ?? ""} onChange={(event) => update(field.key, event.target.value)} /></label>)}</div>
        <div className={styles.calculation}>
          <div><span>Costo total</span><strong>{money(economics.cost)}</strong></div><div><span>Utilidad por pedido</span><strong className={economics.profit < 0 ? styles.negative : ""}>{money(economics.profit)}</strong></div><div><span>Margen real</span><strong>{percent(economics.margin)}</strong></div>
          <p>Ingresos: precio de venta + envío cobrado. Costos: compra + envío pagado + empaque + comisión. Cálculo antes de impuestos.</p>
        </div>
        <div className={styles.suggestion}><div><span>Precio sugerido · margen {values.targetMargin || 0}%</span><strong>{money(economics.suggestedPrice)} MXN</strong></div><button type="button" className={styles.secondary} disabled={economics.suggestedPrice === null || !Number.isFinite(economics.suggestedPrice)} onClick={() => update("salePrice", economics.suggestedPrice.toFixed(2))}>Usar precio</button></div>
        {!economics.complete && <p className={styles.muted}>Indica el precio de compra para calcular la utilidad y la margen.</p>}
        {economics.complete && economics.suggestedPrice === null && <p className={styles.negative}>La suma de la comisión y el margen objetivo debe ser menor al 100%.</p>}
        <h3>Expedición</h3>
        <div className={styles.formGrid}>
          <label>Tipo de envío<select aria-label="Tipo de envío" value={values.shippingMode} onChange={(event) => update("shippingMode", event.target.value)}><option value="included">Incluido en el precio</option><option value="separate">Cobrado por separado</option></select></label>
          <label>Costo de envío (MXN)<input type="number" min="0" step=".01" required value={values.shippingCost} onChange={(event) => update("shippingCost", event.target.value)} /></label>
          {values.shippingMode === "separate" && <label>Envío cobrado al cliente (MXN)<input type="number" min="0" step=".01" required value={values.shippingCharge} onChange={(event) => update("shippingCharge", event.target.value)} /></label>}
          <label>Tipo de envío / transportista<select aria-label="Tipo de envío / transportista" value={values.carrier} onChange={(event) => update("carrier", event.target.value)}><option value="">Por definir</option>{["Estafeta", "DHL", "FedEx", "UPS", "Recogida", ...(values.carrier && !["Estafeta", "DHL", "FedEx", "UPS", "Recogida"].includes(values.carrier) ? [values.carrier] : [])].map((carrier) => <option key={carrier}>{carrier}</option>)}</select></label>
          <label>Entrega estimada (días)<input type="number" min="0" step="1" value={values.deliveryDays ?? ""} onChange={(event) => update("deliveryDays", event.target.value)} placeholder="Por definir" /></label>
          <label>Proveedor<input value={values.supplier} onChange={(event) => update("supplier", event.target.value)} maxLength="200" placeholder="Nombre del proveedor" /></label>
        </div>
        <label className={styles.notes}>Notas internas<textarea value={values.notes} onChange={(event) => update("notes", event.target.value)} maxLength="2000" rows="3" placeholder="Condiciones de compra, embalaje o entrega…" /></label>
        {connected && <div className={styles.publish}><label><input type="checkbox" checked={publishPrice} onChange={(event) => setPublishPrice(event.target.checked)} /> Actualizar también el precio público en WooCommerce</label><p>{publishPrice ? "Se reemplazará el precio vigente, incluidas las promociones. Los demás datos quedan como información interna en WP2." : "Los cambios se guardan en WP2 como información interna. El precio de la tienda se mantiene."}</p></div>}
        {error && <p role="alert" className={styles.error}>{error}</p>}
      </div>
      <footer className={styles.dialogFooter}><button type="button" className={styles.secondary} disabled={saving} onClick={onClose}>Cancelar</button><button type="submit" className={styles.primary} disabled={saving || !connected}>{saving ? "Guardando…" : publishPrice ? "Guardar y actualizar precio público" : "Guardar en WP2"}</button></footer>
    </form>
  </Dialog>;
}

export default function SpecialsAdmin({ catalog }) {
  const [source, setSource] = useState(catalog);
  const [section, setSection] = useState("products");
  const [navOpen, setNavOpen] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [editor, setEditor] = useState(null);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [ruleOpen, setRuleOpen] = useState(false);
  const [ruleMargin, setRuleMargin] = useState("35");
  const [pendingImport, setPendingImport] = useState(null);
  const authRef = useRef("");
  const fileRef = useRef(null);
  const products = useMemo(() => source.map((product) => createAdminProduct(product, product.adminDraft)), [source]);
  const options = useMemo(() => getSpecialsOptions(products), [products]);
  const filtered = useMemo(() => filterAdminProducts(products, filters), [products, filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 25));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * 25, currentPage * 25);
  const known = products.filter((product) => calculateEconomics(product).complete);
  const margins = known.map((product) => calculateEconomics(product).margin).filter((margin) => margin !== null);
  const averageMargin = margins.length ? margins.reduce((a, b) => a + b, 0) / margins.length : null;
  const reviewCount = products.filter(productNeedsReview).length;
  const savedCount = products.filter((product) => product.updatedAt).length;
  const includedCount = products.filter((product) => product.updatedAt && product.shippingMode === "included").length;
  const validRule = Number.isFinite(Number(ruleMargin)) && Number(ruleMargin) >= 0 && Number(ruleMargin) < 100 && ruleMargin !== "";
  const ruleProducts = products.filter((product) => selected.has(product.id)).map((product) => ({ product, economics: calculateEconomics({ ...product, targetMargin: Number(ruleMargin) }) })).filter(({ economics }) => economics.suggestedPrice !== null && Number.isFinite(economics.suggestedPrice));
  const changeFilter = (key, value) => { setFilters((previous) => ({ ...previous, [key]: value })); setPage(1); };
  const navigate = (id) => { setSection(id); setNavOpen(false); };
  const toggleSelected = (id) => setSelected((previous) => { const next = new Set(previous); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const togglePage = () => setSelected((previous) => { const next = new Set(previous); const all = visible.every((product) => next.has(product.id)); visible.forEach((product) => all ? next.delete(product.id) : next.add(product.id)); return next; });

  const request = async (options = {}, authorization = authRef.current, endpoint = "/api/admin/wp2/products") => {
    const response = await fetch(endpoint, { ...options, headers: { Authorization: authorization, "Content-Type": "application/json" }, cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "No se pudo conectar con WP2.");
    return data;
  };
  const connect = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const credentials = btoa(String.fromCharCode(...new TextEncoder().encode(`${username}:${password.replaceAll(" ", "")}`)));
      const authorization = `Basic ${credentials}`;
      const data = await request({}, authorization);
      authRef.current = authorization; setSource(data.products); setConnected(true); setPassword(""); setConnectionOpen(false); setSelected(new Set()); setMessage("WP2 conectado. Catálogo y datos internos cargados.");
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  };
  const refresh = async () => {
    setBusy(true); setError("");
    try { const data = await request(); setSource(data.products); setMessage("Catálogo actualizado desde WP2."); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  };
  const saveOne = async (product, draft, publishPrice = false) => {
    const data = await request({ method: "PUT", body: JSON.stringify({ id: product.id, draft, publishPrice, expectedUpdatedAt: product.updatedAt || "" }) });
    setSource((previous) => previous.map((item) => item.id === data.product.id ? data.product : item));
    return data.product;
  };
  const saveEditor = async (product, draft, publishPrice) => {
    setSaving(true);
    try { await saveOne(product, draft, publishPrice); setEditor(null); setMessage(publishPrice ? "Datos guardados y precio público actualizado en WP2." : "Datos internos guardados en WP2. Precio público sin cambios."); }
    finally { setSaving(false); }
  };
  const saveBatch = async (items) => {
    setSaving(true); setError(""); let completed = 0;
    try {
      for (const { product, draft } of items) { await saveOne(product, draft); completed++; setMessage(`Guardando en WP2: ${completed} de ${items.length}…`); }
      setMessage(`${completed} productos guardados en WP2 como información interna. Precios públicos sin cambios.`); setRuleOpen(false); setPendingImport(null); setSelected(new Set());
    } catch (failure) { setError(`${completed} productos guardados. ${failure.message}`); setRuleOpen(false); setPendingImport(null); }
    finally { setSaving(false); }
  };
  const download = (content, filename, type) => { const url = URL.createObjectURL(new Blob([content], { type })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
  const importFile = async (event) => {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    setError("");
    try { if (file.size > 3000000) throw new Error("El archivo debe ser menor a 3 MB."); const data = readImport(await file.text(), file.name, new Set(products.map((product) => product.id))); setPendingImport(data); }
    catch (failure) { setError(failure.message); }
  };

  const stats = <div className={styles.stats}>
    <div><span>Productos en Especiales</span><strong>{products.length}</strong><small>{connected ? "Catálogo de WP2" : "Catálogo de referencia"}</small></div>
    <div><span>Margen medio</span><strong>{percent(averageMargin)}</strong><small>{known.length} productos con costo de compra</small></div>
    <div><span>Envío incluido</span><strong>{products.length ? Math.round(includedCount / products.length * 100) : 0}%</strong><small>{includedCount} configurados · {products.length - savedCount} pendientes</small></div>
    <div className={styles.darkStat}><span>Necesitan revisión</span><strong>{reviewCount}<b>Revisar</b></strong><small>Costos pendientes, margen o stock</small></div>
  </div>;

  return <div className={styles.app} data-no-runtime-translate>
    {navOpen && <button className={styles.navBackdrop} aria-label="Cerrar navegación" onClick={() => setNavOpen(false)} />}
    <aside className={`${styles.sidebar} ${navOpen ? styles.sidebarOpen : ""}`}>
      <Link href="/admin/especiales" className={styles.brand}>ELITE <b>7</b> PIEL<span>PRODUCT CONTROL</span></Link>
      <p className={styles.navLabel}>WORKSPACE</p>
      <nav aria-label="Administración">{SECTIONS.map((item) => <button key={item.id} className={section === item.id ? styles.navActive : ""} onClick={() => navigate(item.id)}><Icon name={item.icon} />{item.label}{item.id === "products" && <span>{products.length}</span>}</button>)}</nav>
      <div className={styles.sidebarBottom}><div><span className={styles.connectionDot} />{connected ? "WP2 conectado" : "WP2 por conectar"}<small>Backend WooCommerce · MXN</small></div><p><b>CJ</b> Integración posterior</p></div>
    </aside>
    <div className={styles.workspace}>
      <div className={styles.topbar}><button className={`${styles.iconButton} ${styles.mobileMenu}`} aria-label="Abrir navegación" aria-expanded={navOpen} onClick={() => setNavOpen(!navOpen)}><Icon name="menu" /></button><div className={styles.market}><b>Especiales</b><span>México · MXN</span></div><div className={styles.topbarRight}><span className={styles.previewBadge}>Versión admin</span><Link href="/especiales">Ver tienda ↗</Link><button className={styles.secondary} onClick={() => setConnectionOpen(true)}>{connected ? "Cuenta WP2" : "Conectar WP2"}</button></div></div>
      <main className={styles.main}>
        <header className={styles.pageHeading}><div><p className={styles.eyebrow}>ELITE 7 PIEL · COMMERCE</p><h1>{section === "overview" ? "Resumen del catálogo" : section === "shipping" ? "Control de expediciones" : section === "margins" ? "Costos y márgenes" : section === "connections" ? "Conexiones" : section === "clients" ? "Base de clientes" : "Inventario de productos"}</h1><p>Compra, venta, margen y envío. Todo el catálogo de Especiales en un solo lugar.</p></div><div className={styles.headingActions}><button className={styles.secondary} onClick={refresh} disabled={!connected || busy}>{busy ? "Cargando…" : "Actualizar WP2"}</button><button className={styles.primary} onClick={() => setRuleOpen(true)} disabled={!connected || !selected.size || saving}><Icon name="chart" size={17} /> Reglas de precio</button></div></header>
        {!connected && <div className={styles.info}>Vista del catálogo de referencia. <button onClick={() => setConnectionOpen(true)}>Conecta WP2</button> para cargar y editar costos, márgenes y expediciones compartidos.</div>}
        {message && <div className={styles.success} role="status">{message}<button aria-label="Cerrar mensaje" onClick={() => setMessage("")}>×</button></div>}
        {error && !connectionOpen && <div className={styles.error} role="alert">{error}</div>}
        {stats}
        {section === "clients" ? <ClientsPanel connected={connected} request={(options) => request(options, authRef.current, "/api/admin/wp2/customers")} onConnect={() => setConnectionOpen(true)} /> : section === "connections" ? <div className={styles.connectionGrid}><section className={styles.panel}><div className={styles.connectionTitle}><Icon name="link" /><h2>WordPress · WP2</h2><span className={styles.pill}>{connected ? "Conectado" : "Sin conexión"}</span></div><p>Catálogo, precios de compra, márgenes y condiciones de envío guardados en el backend WooCommerce de Especiales.</p><p className={styles.muted}>Las credenciales permanecen sólo durante esta sesión. No se guardan en el navegador.</p><button className={styles.primary} onClick={() => setConnectionOpen(true)}>{connected ? "Gestionar conexión" : "Conectar WP2"}</button></section><section className={styles.panel}><div className={styles.connectionTitle}><b className={styles.cjLogo}>CJ</b><h2>CJdropshipping</h2><span className={styles.pill}>Próxima etapa</span></div><p>Esta versión trabaja con Especiales y WP2. La conexión de productos, compras y expediciones CJ se añadirá después.</p></section></div> : section === "overview" ? <div className={styles.overview}><section className={styles.panel}><h2>Completar información de compra</h2><p>{products.length - known.length} productos aún necesitan precio de compra.</p><progress value={known.length} max={products.length || 1} /><p className={styles.muted}>Las márgenes se calculan cuando existe un costo real.</p><button className={styles.secondary} onClick={() => { setSection("products"); setFilters({ ...EMPTY_FILTERS, margin: "missing" }); setPage(1); }}>Ver costos pendientes</button></section><section className={styles.panel}><h2>Productos a revisar</h2>{products.filter(productNeedsReview).slice(0, 5).map((product) => <button key={product.id} className={styles.reviewProduct} onClick={() => setEditor(product)}><span>{product.title}</span><small>{product.purchasePrice === null ? "Falta costo" : "Revisar margen / stock"}</small><Icon name="edit" size={16} /></button>)}</section></div> : <>
          {section === "margins" && <div className={styles.info}>La margen real considera compra, envío, empaque y comisión. Selecciona productos con costo de compra para aplicar una margen objetivo.</div>}
          {section === "shipping" && <div className={styles.info}>Edita costo de envío, transportista, cobro al cliente y tiempo de entrega. La margen incluye el costo de envío, incluso si se cobra por separado.</div>}
          <section className={styles.inventory} aria-label="Inventario de Especiales">
            <div className={styles.inventoryTabs}><div>{[{ id: "all", label: "Todos", count: products.length }, { id: "ready", label: "Listos", count: products.length - reviewCount }, { id: "review", label: "Por revisar", count: reviewCount }, { id: "drafts", label: "Guardados en WP2", count: savedCount }].map((tab) => <button key={tab.id} className={filters.tab === tab.id ? styles.tabActive : ""} onClick={() => changeFilter("tab", tab.id)}>{tab.label}<span>{tab.count}</span></button>)}</div><button className={styles.secondary} onClick={() => download(serializeCsv(filtered), "elite7-especiales.csv", "text/csv;charset=utf-8")}><Icon name="download" size={16} /> Exportar CSV</button></div>
            <div className={styles.filters}><label className={styles.searchField}><Icon name="search" size={17} /><input aria-label="Buscar producto" placeholder="Buscar producto, marca o ID…" value={filters.search} onChange={(event) => changeFilter("search", event.target.value)} /></label><select aria-label="Categoría" value={filters.category} onChange={(event) => changeFilter("category", event.target.value)}><option value="">Todas las categorías</option>{options.categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select><select aria-label="Marca" value={filters.brand} onChange={(event) => changeFilter("brand", event.target.value)}><option value="">Todas las marcas</option>{options.brands.map((brand) => <option key={brand.name}>{brand.name}</option>)}</select><select aria-label="Envío" value={filters.shipping} onChange={(event) => changeFilter("shipping", event.target.value)}><option value="">Todos los envíos</option><option value="included">Envío incluido</option><option value="separate">Envío separado</option></select><select aria-label="Margen" value={filters.margin} onChange={(event) => changeFilter("margin", event.target.value)}><option value="">Todas las márgenes</option><option value="missing">Sin costo de compra</option><option value="low">Bajo el objetivo</option><option value="healthy">Objetivo alcanzado</option></select><select aria-label="Ordenar" value={filters.sort} onChange={(event) => changeFilter("sort", event.target.value)}><option value="name">Nombre A–Z</option><option value="price_low">Precio: menor a mayor</option><option value="price_high">Precio: mayor a menor</option><option value="margin">Margen: menor a mayor</option></select><button className={styles.textButton} onClick={() => { setFilters(EMPTY_FILTERS); setPage(1); }}>Limpiar</button></div>
            <div className={styles.selectionBar}><span>{filtered.length} productos encontrados{selected.size > 0 && ` · ${selected.size} seleccionados`}</span><div>{selected.size > 0 && <><button onClick={() => setSelected(new Set(filtered.map((product) => product.id)))}>Seleccionar {filtered.length} filtrados</button><button onClick={() => setSelected(new Set())}>Quitar selección</button></>}<button disabled={!connected} onClick={() => fileRef.current.click()}>Importar CSV / respaldo</button><button onClick={() => download(JSON.stringify({ version: 1, catalog: "especiales", products: products.map((product) => ({ id: product.id, ...validateDraft(product) })) }, null, 2), "elite7-especiales-respaldo.json", "application/json")}>Respaldo JSON</button><input ref={fileRef} type="file" accept=".csv,.json" hidden onChange={importFile} /></div></div>
            <div className={styles.tableWrap}><table><thead><tr><th><input type="checkbox" aria-label="Seleccionar página" checked={visible.length > 0 && visible.every((product) => selected.has(product.id))} onChange={togglePage} /></th><th>Producto / marca</th><th>Compra MXN</th><th>Venta MXN</th><th>Envío MXN</th><th>Entrega</th><th>Utilidad MXN</th><th>Margen</th><th>Estado</th><th>Editar</th></tr></thead><tbody>{visible.map((product) => { const economics = calculateEconomics(product); return <tr key={product.id} data-product-id={product.id}><td><input type="checkbox" aria-label={`Seleccionar ${product.title}`} checked={selected.has(product.id)} onChange={() => toggleSelected(product.id)} /></td><td><ProductIdentity product={product} /></td><td>{money(product.purchasePrice)}</td><td><strong>{money(product.salePrice)}</strong>{product.salePrice !== product.price && <small className={styles.publicPrice}>Tienda: {money(product.price)}</small>}</td><td>{money(product.updatedAt ? product.shippingCost : null)}<small className={styles.publicPrice}>{!product.updatedAt ? "Por configurar" : product.shippingMode === "included" ? "Incluido" : `Cliente: ${money(product.shippingCharge)}`}</small></td><td>{product.carrier || "Por definir"}<small className={styles.publicPrice}>{product.deliveryDays === null ? "Sin plazo" : `${product.deliveryDays} días`}</small></td><td className={economics.profit < 0 ? styles.negative : ""}>{money(economics.profit)}</td><td><span className={`${styles.marginBadge} ${economics.margin === null ? "" : economics.margin < product.targetMargin ? styles.lowMargin : styles.goodMargin}`}>{percent(economics.margin)}</span></td><td><span className={styles.pill}>{product.purchasePrice === null ? "Falta costo" : productNeedsReview(product) ? "Por revisar" : "Listo"}</span></td><td><button className={styles.iconButton} aria-label={`Editar ${product.title}`} onClick={() => setEditor(product)}><Icon name="edit" size={17} /></button></td></tr>; })}</tbody></table></div>
            <div className={styles.mobileProducts}>{visible.map((product) => { const economics = calculateEconomics(product); return <article key={product.id} className={styles.mobileProduct}><div className={styles.mobileProductTop}><input type="checkbox" aria-label={`Seleccionar ${product.title}`} checked={selected.has(product.id)} onChange={() => toggleSelected(product.id)} /><ProductIdentity product={product} /></div><div className={styles.mobileMetrics}><span>Compra<strong>{money(product.purchasePrice)}</strong></span><span>Venta<strong>{money(product.salePrice)}</strong></span><span>Margen<strong>{percent(economics.margin)}</strong></span><span>Envío<strong>{money(product.shippingCost)}</strong></span></div><div className={styles.mobileProductBottom}><span className={styles.pill}>{product.purchasePrice === null ? "Falta costo" : productNeedsReview(product) ? "Por revisar" : "Listo"}</span><button className={styles.secondary} aria-label={`Editar ${product.title}`} onClick={() => setEditor(product)}><Icon name="edit" size={16} /> Editar</button></div></article>; })}</div>
            {!filtered.length && <div className={styles.empty}><Icon name="search" size={30} /><h2>No hay productos con estos filtros.</h2><button className={styles.secondary} onClick={() => { setFilters(EMPTY_FILTERS); setPage(1); }}>Ver todos los productos</button></div>}
            <footer className={styles.pagination}><span>{filtered.length ? (currentPage - 1) * 25 + 1 : 0}–{Math.min(currentPage * 25, filtered.length)} de {filtered.length} productos</span><div><button aria-label="Página anterior" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>←</button><b>{currentPage} / {pageCount}</b><button aria-label="Página siguiente" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>→</button></div></footer>
          </section>
        </>}
        <p className={styles.bottomNote}>WP2 · Datos internos del negocio · MXN · CJ en una próxima etapa</p>
      </main>
    </div>
    {editor && <Editor product={editor} connected={connected} saving={saving} onSave={saveEditor} onClose={() => setEditor(null)} />}
    {connectionOpen && <Dialog title={connected ? "Conexión WordPress WP2" : "Conectar WP2"} onClose={busy ? () => {} : () => { setConnectionOpen(false); setError(""); }}><form onSubmit={connect}><div className={styles.editorBody}><p>Conecta el backend de Especiales con un usuario administrador o gestor de tienda de WordPress.</p><label>Usuario WordPress<input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /></label><label>Contraseña de aplicación<input type="password" autoComplete="off" required value={password} onChange={(event) => setPassword(event.target.value)} /></label><p className={styles.muted}>Se crea en <a href={`${SECONDARY_WORDPRESS_URL}/wp-admin/profile.php`} target="_blank" rel="noopener noreferrer">tu perfil de WP2 ↗</a>. Usa una contraseña de aplicación, no la contraseña de acceso habitual. Las credenciales no se almacenan; al recargar debes reconectar.</p>{error && <p role="alert" className={styles.error}>{error}</p>}</div><footer className={styles.dialogFooter}>{connected && <button type="button" className={styles.secondary} disabled={busy} onClick={() => { authRef.current = ""; setConnected(false); setSource(catalog); setPassword(""); setSelected(new Set()); setMessage("Sesión WP2 cerrada."); setConnectionOpen(false); }}>Desconectar</button>}<button className={styles.primary} disabled={busy}>{busy ? "Conectando…" : "Conectar y cargar catálogo"}</button></footer></form></Dialog>}
    {ruleOpen && <Dialog title="Regla de margen objetivo" onClose={saving ? () => {} : () => setRuleOpen(false)}><div className={styles.editorBody}><p>{selected.size} productos seleccionados. Se calculará un precio de venta a partir de sus costos reales, envío, empaque y comisión.</p><label>Margen objetivo (%)<input type="number" min="0" max="99.99" step=".01" value={ruleMargin} onChange={(event) => setRuleMargin(event.target.value)} /></label><p><strong>{validRule ? ruleProducts.length : 0}</strong> productos elegibles. Los productos sin precio de compra o con comisión incompatible no se modificarán.</p><div className={styles.rulePreview}>{validRule && ruleProducts.slice(0, 6).map(({ product, economics }) => <p key={product.id}><span>{product.title}</span><strong>{money(economics.suggestedPrice)}</strong></p>)}</div><p className={styles.muted}>Se guardan precios propuestos en WP2. Esta regla no publica precios en la tienda.</p></div><footer className={styles.dialogFooter}><button className={styles.secondary} disabled={saving} onClick={() => setRuleOpen(false)}>Cancelar</button><button className={styles.primary} disabled={!validRule || !ruleProducts.length || saving || !connected} onClick={() => saveBatch(ruleProducts.map(({ product, economics }) => ({ product, draft: validateDraft({ ...product, targetMargin: Number(ruleMargin), salePrice: economics.suggestedPrice }) })))}>{saving ? "Guardando…" : "Aplicar y guardar en WP2"}</button></footer></Dialog>}
    {pendingImport && <Dialog title="Revisar importación" onClose={saving ? () => {} : () => setPendingImport(null)}><div className={styles.editorBody}><p>Se actualizarán los datos internos de <strong>{Object.keys(pendingImport).length} productos</strong> en WP2. Los precios públicos no se modifican.</p><p className={styles.muted}>Los campos incluidos en el archivo reemplazarán los datos internos correspondientes. El resto se conserva.</p></div><footer className={styles.dialogFooter}><button className={styles.secondary} disabled={saving} onClick={() => setPendingImport(null)}>Cancelar</button><button className={styles.primary} disabled={saving || !connected} onClick={() => saveBatch(Object.entries(pendingImport).map(([id, draft]) => ({ product: products.find((product) => product.id === id), draft: validateDraft({ ...products.find((product) => product.id === id), ...draft }) })))}>{saving ? "Guardando…" : "Guardar importación en WP2"}</button></footer></Dialog>}
  </div>;
}
