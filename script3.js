const feedUrl = "transformed_events.json"; 

let allEvents = [];
let iso;

const searchInput = document.getElementById("event-search");
const categoryFilter = document.getElementById("categoryFilter");
const eventFeed = document.getElementById("eventFeed");
const drawer = document.querySelector("#drawer-overview");


async function loadEvents() {
    try {
        const response = await fetch(feedUrl);
        allEvents = await response.json();

        renderEvents(allEvents);

        renderEvents(allEvents);

        imagesLoaded(eventFeed, () => {
            iso = new Isotope(eventFeed, {
                itemSelector: ".event-item",
                masonry: {
                    gutter: 16
                }
            });
        });

        categoryFilter.addEventListener("change", filterEvents);
        searchInput.addEventListener("input", filterEvents);

    } catch (error) {
        console.error("Fout bij laden events:", error);
        eventFeed.innerHTML =
            "<p>Kon de evenementen niet laden.</p>";
    }

    initDrawer();
}

function filterEvents() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filtered = allEvents.filter(event => {

        const matchesCategory =
            selectedCategory === "all" ||
            event.category === selectedCategory;

        const matchesSearch =
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    renderEvents(filtered);
}

function renderEvents(events) {

    if (events.length === 0) {
        eventFeed.innerHTML =
            "<p>Geen evenementen gevonden.</p>";
        return;
    }

    eventFeed.innerHTML = events.map(event => `
        <div class="event-item">

            <wa-card class="card-overview">
            
                <img slot="media"src = ${event.image} />

                <strong>${event.title}</strong>
                <p><small class="wa-caption-s">
                    ${event.calendarSummary}
                </small></p>

                <button
                    class="open-drawer-btn"
                    data-title="${event.title}"
                    data-organizer="${event.organizer}"
                    data-description="${event.description}">
                    Meer info
                </button>
            </wa-card>

        </div>
    `).join("");

    if (iso) {
    iso.destroy();
    }

    imagesLoaded(eventFeed, () => {
        iso = new Isotope(eventFeed, {
            itemSelector: '.event-item',
            masonry: {
                gutter: 16
            }
        });
    });
}

function initDrawer() {
    document.addEventListener("click", (e) => {
        const button = e.target.closest(".open-drawer-btn");
            if (!button) return;
        drawer.querySelector(".drawer-title").textContent =
            button.dataset.title;
        drawer.querySelector(".drawer-organizer").textContent =
            button.dataset.organizer;
        drawer.querySelector(".drawer-description").textContent =
            button.dataset.description;
        drawer.open = true;
    });
}

initDrawer();
loadEvents();