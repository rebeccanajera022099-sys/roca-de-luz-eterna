async function loadEvents() {
  const container = document.getElementById("events-list");
  if (!container) return;

  // IMPORTANT: update these only if your GitHub username/repo changes
  const owner = "rebeccanajera022099-sys";
  const repo = "roca-de-luz-eterna";
  const path = "content/events";

  container.innerHTML = "Loading events...";

  try {
    // 1) List files in the folder via GitHub API
    const listUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const listRes = await fetch(listUrl);

    if (!listRes.ok) {
      throw new Error(`GitHub list failed: ${listRes.status}`);
    }

    const files = await listRes.json();

    // 2) Keep only .json files (ignore anything else)
    const jsonFiles = files
      .filter(f => f.type === "file" && f.name.toLowerCase().endsWith(".json"));

    if (jsonFiles.length === 0) {
      container.innerHTML = "<li>No events yet.</li>";
      return;
    }

    // 3) Fetch each event file’s raw content
    const events = [];
    for (const f of jsonFiles) {
      const eventRes = await fetch(f.download_url);
      if (!eventRes.ok) continue;

      const ev = await eventRes.json();
      events.push(ev);
    }

    // 4) Sort by date (ascending)
    events.sort((a, b) => (a.date || "").localeCompare(b.date || ""));

    // 5) Render
    container.innerHTML = events.map(ev => {
      const date = ev.date || "";
      const title = ev.title_es || ev.title_en || "Evento";
      const where = ev.where_es || ev.where_en || "";
      return `<li><strong>${date}</strong> — ${title}${where ? ` (${where})` : ""}</li>`;
    }).join("");

  } catch (error) {
    console.error(error);
    container.innerHTML = "<li>Unable to load events.</li>";
  }
}

loadEvents();
