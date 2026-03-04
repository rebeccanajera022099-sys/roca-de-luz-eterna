async function loadEvents() {
  const container = document.getElementById("events-list");

  try {
    const response = await fetch("/content/events/");
    const text = await response.text();

    container.innerHTML = "Events loading...";
  } catch (error) {
    container.innerHTML = "Unable to load events.";
  }
}

loadEvents();
