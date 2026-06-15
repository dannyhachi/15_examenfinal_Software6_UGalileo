// app.js
const $ = (s) => document.querySelector(s)

const state = {
	query: "",
	tipo: "all",
	sortAsc: true,
	compact: false,
	contrastHigh: false,
}

// Datos base: enfocados en impacto positivo + repercusiones, sin perder el contexto internacional
const items = [
	{
		id: "ctx-1851",
		tipo: "contexto",
		year: 1851,
		title: "Gran Exposición (Londres)",
		desc: "Referente temprano del formato de feria industrial internacional que inspira eventos posteriores.",
		keywords: ["crystal palace", "industria", "feria"],
	},
	{
		id: "ctx-1889",
		tipo: "contexto",
		year: 1889,
		title: "Exposición Universal (París)",
		desc: "Consolidación del modelo: arquitectura emblemática y discurso de modernidad como propaganda estatal.",
		keywords: ["modernidad", "paris"],
	},
	{
		id: "eca-1896",
		tipo: "urbanismo",
		year: 1896,
		title: "Preparación urbana y obras",
		desc: "Aceleración de obras, trazado y embellecimiento urbano para sostener la narrativa de progreso.",
		keywords: ["boulevard", "reforma", "iluminacion", "obras publicas"],
	},
	{
		id: "eca-1897",
		tipo: "exposicion",
		year: 1897,
		title: "Exposición Centroamericana (Guatemala)",
		desc: "Vitrina de modernización: industria, cultura y estrategia para atraer inversión vinculada al ferrocarril.",
		keywords: ["guatemala", "modernizacion", "pabellones", "ferrocarril"],
	},
	{
		id: "eca-1897-econ",
		tipo: "economia",
		year: 1897.5,
		title: "Crisis financiera y presión fiscal",
		desc: "Gasto elevado + ingresos frágiles (café) producen desbalance, tensión social y pérdida de confianza.",
		keywords: ["cafe", "bancos", "inflacion", "deuda"],
	},
	{
		id: "eca-1898",
		tipo: "economia",
		year: 1898,
		title: "Repercusiones políticas",
		desc: "La crisis acelera conflictos y reconfigura el poder, marcando un giro político para el país.",
		keywords: ["inestabilidad", "levantamientos", "poder"],
	},
]

const galleryItems = [
	{ src: "https://picsum.photos/seed/expo1/1200/800", cap: "Placeholder — Arquitectura / pabellones" },
	{ src: "https://picsum.photos/seed/expo2/1200/800", cap: "Placeholder — Material gráfico / afiches" },
	{ src: "https://picsum.photos/seed/expo3/1200/800", cap: "Placeholder — Objetos / industria" },
	{ src: "https://picsum.photos/seed/expo4/1200/800", cap: "Placeholder — Registro / visitantes" },
	{ src: "https://picsum.photos/seed/expo5/1200/800", cap: "Placeholder — Infraestructura" },
	{ src: "https://picsum.photos/seed/expo6/1200/800", cap: "Placeholder — Ciudad / avenida" },
]

function normalize(str) {
	return (str || "")
		.toString()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
}

function matches(item) {
	const q = normalize(state.query)
	const haystack = normalize([item.title, item.desc, item.year, item.tipo, ...(item.keywords || [])].join(" "))
	const okQuery = q === "" || haystack.includes(q)
	const okTipo = state.tipo === "all" || item.tipo === state.tipo
	return okQuery && okTipo
}

function sortItems(arr) {
	return [...arr].sort((a, b) => (state.sortAsc ? a.year - b.year : b.year - a.year))
}

function labelTipo(tipo) {
	if (tipo === "exposicion") return "Exposición"
	if (tipo === "urbanismo") return "Urbanismo"
	if (tipo === "economia") return "Economía"
	return "Contexto"
}

function renderTimeline() {
	const root = $("#timelineList")
	const filtered = sortItems(items.filter(matches))

	if (filtered.length === 0) {
		root.innerHTML = `<div class="item"><h3>Sin resultados</h3><p>Prueba con otra búsqueda o cambia el filtro.</p></div>`
		return
	}

	root.innerHTML = filtered
		.map((it) => {
			const compactClass = state.compact ? " compact" : ""
			return `
				<article class="item${compactClass}" data-id="${it.id}">
					<div class="item-head">
						<h3>${String(it.year).replace(".5", "")} — ${it.title}</h3>
						<span class="badge ${it.tipo}">${labelTipo(it.tipo)}</span>
					</div>
					<p>${it.desc}</p>
				</article>
			`
		})
		.join("")
}

function renderGallery() {
	const root = $("#gallery")
	root.innerHTML = galleryItems
		.map((g) => {
			return `
				<figure class="tile">
					<img src="${g.src}" alt="${g.cap}" loading="lazy" />
					<figcaption class="cap">${g.cap}</figcaption>
				</figure>
			`
		})
		.join("")
}

function shuffleGallery() {
	for (let i = galleryItems.length - 1; i > 0; i ) {
		const j = Math.floor(Math.random() * (i + 1))
		;[galleryItems[i], galleryItems[j]] = [galleryItems[j], galleryItems[i]]
	}
	renderGallery()
}

function setContrast(high) {
	state.contrastHigh = high
	document.documentElement.dataset.contrast = high ? "high" : "normal"
	$("#btnTheme")?.setAttribute("aria-pressed", String(high))
}

function bindUI() {
	$("#q")?.addEventListener("input", (e) => {
		state.query = e.target.value
		renderTimeline()
	})

	$("#tipo")?.addEventListener("change", (e) => {
		state.tipo = e.target.value
		renderTimeline()
	})

	$("#btnSort")?.addEventListener("click", (e) => {
		state.sortAsc = !state.sortAsc
		e.target.setAttribute("aria-pressed", String(!state.sortAsc))
		e.target.textContent = state.sortAsc ? "Orden: ascendente" : "Orden: descendente"
		renderTimeline()
	})

	$("#btnCompact")?.addEventListener("click", (e) => {
		state.compact = !state.compact
		e.target.setAttribute("aria-pressed", String(state.compact))
		e.target.textContent = state.compact ? "Vista detallada" : "Vista compacta"
		renderTimeline()
	})

	$("#btnShuffle")?.addEventListener("click", shuffleGallery)

	$("#btnTheme")?.addEventListener("click", () => setContrast(!state.contrastHigh))
}

function init() {
	$("#year").textContent = new Date().getFullYear()
	setContrast(false)
	renderTimeline()
	renderGallery()
	bindUI()
}

document.addEventListener("DOMContentLoaded", init)