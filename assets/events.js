async function loadEvents() {
  const container = document.getElementById("events");
  if (!container) return;

  // Update only if your GitHub username/repo changes
  const owner = "rebeccanajera022099-sys";
  const repo = "roca-de-luz-eterna";
  const path = "content/events";

  container.innerHTML = "<div class='card'>Cargando eventos…</div>";

  try {
    // List files in /content/events using GitHub Contents API
    const listUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const listRes = await fetch(listUrl);

    if (!listRes.ok) throw new Error(`GitHub list failed: ${listRes.status}`);

    const files = await listRes.json();

    const jsonFiles = files
      .filter(f => f.type === "file" && f.name.toLowerCase().endsWith(".json"));

    if (jsonFiles.length === 0) {
      container.innerHTML = "<div class='card'>No hay eventos todavía.</div>";
      return;
    }

    // Fetch each event json
    const events = [];
    for (const f of jsonFiles) {
      const res = await fetch(f.download_url);
      if (!res.ok) continue;
      const ev = await res.json();
      events.push(ev);
    }

    // Sort by date
    events.sort((a, b) => (a.date || "").localeCompare(b.date || ""));

    // Render as cards
    container.innerHTML = events.map(ev => {
      const date = ev.date || "";
      const title = ev.title_es || ev.title_en || "Evento";
      const where = ev.where_es || ev.where_en || "";
      return `
        <div class="card">
          <h3 style="margin:0 0 6px 0;">${title}</h3>
          <p style="margin:0;"><strong>${date}</strong>${where ? ` • ${where}` : ""}</p>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error(err);
    container.innerHTML = "<div class='card'>No se pudieron cargar los eventos.</div>";
  }
}

loadEvents();
