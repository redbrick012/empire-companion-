let characters = [];
let currentCharacter = null;

async function loadCharacters() {
    try {
        const response = await fetch("data/characters.json");

        if (!response.ok) {
            throw new Error("Could not load character data");
        }

        const data = await response.json();

        characters = data.characters || [];

        if (characters.length === 0) {
            showError("No characters found.");
            return;
        }

        currentCharacter = characters[0];

        displayCharacter(currentCharacter);

    } catch (error) {
        console.error(error);
        showError("Unable to load character data.");
    }
}


function displayCharacter(character) {

    document.getElementById("characterName").textContent =
        character.name || "Unnamed Character";

    document.getElementById("characterSummary").textContent =
        `${character.nation || ""} • ${character.lineage || ""} • ${character.archetype || ""}`;

    document.getElementById("levelBadge").textContent =
        `Level ${character.level ?? "?"}`;

    document.getElementById("statusBadge").textContent =
        character.status || "Unknown";

    document.getElementById("bannerBadge").textContent =
        character.banner || "No Banner";

    document.getElementById("cid").textContent =
        character.cid || "—";

    document.getElementById("nation").textContent =
        character.nation || "—";

    document.getElementById("lineage").textContent =
        character.lineage || "—";

    document.getElementById("archetype").textContent =
        character.archetype || "—";

    document.getElementById("virtue").textContent =
        character.virtue || "—";

    document.getElementById("banner").textContent =
        character.banner || "—";

    document.getElementById("coven").textContent =
        character.coven || "—";

    document.getElementById("sect").textContent =
        character.sect || "—";

    document.getElementById("territory").textContent =
        character.territory || "—";

    document.getElementById("resource").textContent =
        character.resource || "—";

    document.getElementById("level").textContent =
        character.level ?? "—";

    document.getElementById("status").textContent =
        character.status || "—";

    document.getElementById("pointsSpent").textContent =
        character.pointsSpent ?? "—";

    displayBondedItems(character.bondedItems || []);
}


function displayBondedItems(items) {

    const container = document.getElementById("bondedItems");

    container.innerHTML = "";

    if (items.length === 0) {

        container.innerHTML = `
            <div class="item-card">
                <div class="item-name">
                    No bonded items
                </div>
            </div>
        `;

        return;
    }

    items.forEach(item => {

        const card = document.createElement("div");

        card.className = "item-card";

        card.innerHTML = `
            <div class="item-name">
                ${escapeHTML(item.name || "Unnamed Item")}
            </div>

            <div class="item-type">
                ${escapeHTML(item.type || "")}
                ${item.id ? " • ID " + escapeHTML(item.id) : ""}
            </div>

            <div class="item-description">
                ${escapeHTML(item.description || "")}
            </div>
        `;

        container.appendChild(card);
    });
}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


function showError(message) {

    const name = document.getElementById("characterName");

    if (name) {
        name.textContent = "Error";
    }

    console.error(message);
}


/* Start the application */

document.addEventListener("DOMContentLoaded", () => {
    loadCharacters();
});
