let characters = [];
let currentCharacter = null;

const STORAGE_KEY = "empireCompanionCharacters";
const CURRENT_KEY = "empireCompanionCurrent";


async function startApp() {

    // First try characters saved on this device
    const savedCharacters = localStorage.getItem(STORAGE_KEY);

    if (savedCharacters) {
        try {
            characters = JSON.parse(savedCharacters);
        } catch (error) {
            console.error("Could not read saved characters", error);
            characters = [];
        }
    }

    // If there are no local characters, load our example character
    if (characters.length === 0) {
        await loadExampleCharacter();
    }

    buildCharacterSelector();

    const savedCurrent = localStorage.getItem(CURRENT_KEY);

    if (savedCurrent) {
        const found = characters.find(character => character.cid === savedCurrent);

        if (found) {
            currentCharacter = found;
        }
    }

    if (!currentCharacter) {
        currentCharacter = characters[0];
    }

    if (currentCharacter) {
        displayCharacter(currentCharacter);
    }
}


async function loadExampleCharacter() {

    try {

        const response = await fetch("data/characters.json");

        if (!response.ok) {
            throw new Error("Could not load example character");
        }

        const data = await response.json();

        characters = data.characters || [];

        saveCharacters();

    } catch (error) {

        console.error(error);

        characters = [];

    }
}


function saveCharacters() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(characters)
    );
}


function buildCharacterSelector() {

    const existing = document.getElementById("characterSelector");

    if (!existing) {
        return;
    }

    existing.innerHTML = "";

    characters.forEach(character => {

        const option = document.createElement("option");

        option.value = character.cid;

        option.textContent =
            `${character.name} — ${character.nation || ""}`;

        existing.appendChild(option);

    });

    if (currentCharacter) {
        existing.value = currentCharacter.cid;
    }
}


function changeCharacter(cid) {

    const character = characters.find(
        character => character.cid === cid
    );

    if (!character) {
        return;
    }

    currentCharacter = character;

    localStorage.setItem(
        CURRENT_KEY,
        character.cid
    );

    displayCharacter(character);
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

    displayBondedItems(
        character.bondedItems || []
    );

    const selector =
        document.getElementById("characterSelector");

    if (selector) {
        selector.value = character.cid;
    }
}


function displayBondedItems(items) {

    const container =
        document.getElementById("bondedItems");

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

        const card =
            document.createElement("div");

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

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


document.addEventListener(
    "DOMContentLoaded",
    startApp
);

function openPDLogin() {

    const status = document.getElementById("pdConnectionStatus");

    status.innerHTML =
        "🔄 Opening Profound Decisions...";

    // Directly navigate to PD rather than using window.open().
    window.location.href =
        "https://www.profounddecisions.co.uk/";
}


async function testPDConnection() {

    const status =
        document.getElementById("pdConnectionStatus");

    status.innerHTML =
        "🔄 Testing connection...";

    try {

        const response = await fetch(
            "https://www.profounddecisions.co.uk/",
            {
                method: "GET",
                credentials: "include"
            }
        );

        status.innerHTML =
            "🟢 PD responded with HTTP " +
            response.status +
            ".<br><br>" +
            "The browser allowed our request to reach PD.";

        console.log("PD response:", response);

    } catch (error) {

        console.error("PD connection test failed:", error);

        status.innerHTML =
            "🔴 Browser blocked the request.<br><br>" +
            "<strong>This is useful!</strong><br>" +
            "It means GitHub Pages cannot directly read PD from JavaScript.";
    }
}
