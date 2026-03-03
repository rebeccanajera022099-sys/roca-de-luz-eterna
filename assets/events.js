(async function () {
  const el = document.getElementById("events");
  if (!el) return;

  const isEnglish = document.documentElement.lang === "en";

  try {
    const res = await fetch("/content/events.json", { cache: "no-store" });
    const events = await res.json();

    if (!Array.isArray(events) || events.length === 0) {
      el.innerHTML = `<div class="card">${isEnglish ? "No events yet." : "Aún no hay eventos."}</div>`;
      return;
    }

    el.innerHTML = events
      .sort((a,b) => (a.date || "").localeCompare(b.date || ""))
      .map(e => `
        <div class="card">
          <div style="color:#666; font-size:13px;">${e.date || ""}</div>
          <div style="font-weight:700;">${isEnglish ? (e.title_en||"") : (e.title_es||"")}</div>
          <div style="color:#666;">${isEnglish ? (e.where_en||"") : (e.where_es||"")}</div>
        </div>
      `)
      .join("");
  } catch (err) {
    el.innerHTML = `<div class="card">${isEnglish ? "Could not load events." : "No se pudieron cargar los eventos."}</div>`;
  }
})();
