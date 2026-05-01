const UPLOAD_KEY = "dimbel-upload-key";
let entries = [
    {
        title: "Morning Pages: Energy in Motion",
        date: "May 1, 2026",
        content: [
            "Today I leaned into the rhythm of a slow morning and found that the first draft of an idea always feels quieter than expected.",
            "I took notes by hand, then built the outline digitally before returning to the pen. It helped keep the creative energy moving without losing the shape of the thought.",
            "Each entry feels less like a log and more like a way to make the small daily shifts visible. That's the thing I want this journal to be.",
        ],
    },
    {
        title: "Design Patterns for Slow Work",
        date: "April 27, 2026",
        content: [
            "A strong layout is not only about visual balance, it's also about giving the reader a place to begin and a place to return.",
            "I experimented with a right-hand panel for navigation and a larger reading area on the left, which makes the experience feel more contemplative.",
            "Consistency in spacing and typographic hierarchy allows the page to breathe, even when the content is dense.",
        ],
    },
    {
        title: "Why Entry-Based Pages Work",
        date: "April 20, 2026",
        content: [
            "Breaking content into discrete entries makes it easier to choose what to focus on without overwhelming the page.",
            "The navigation panel can be a simple list, but it plays a huge role in helping visitors discover and revisit entries.",
            "A clean, centered reading panel with a strong title gives each post enough room to feel important.",
        ],
    },
];

const entryList = document.getElementById("entry-list");
const entryDisplay = document.getElementById("entry-display");
const fileInput = document.getElementById("entry-file-input");
const uploadKeyInput = document.getElementById("upload-key");
const uploadButton = document.getElementById("upload-entry-btn");
const uploadMessage = document.getElementById("upload-message");

function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function loadSavedEntries() {
    const stored = localStorage.getItem("journalEntries");
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length) {
                entries = parsed;
            }
        } catch (error) {
            console.warn("Could not parse saved journal entries.", error);
        }
    }
}

function saveEntries() {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
}

function parseEntryFile(text, fileName) {
    const title = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").trim();
    const paragraphs = text
        .trim()
        .split(/\r?\n\s*\r?\n/)
        .map((block) => block.trim())
        .filter(Boolean);

    return {
        title: title || "New Entry",
        date: formatDate(new Date()),
        content: paragraphs.length ? paragraphs : [text.trim() || ""],
    };
}

function showUploadMessage(message, isError = false) {
    if (!uploadMessage) return;
    uploadMessage.textContent = message;
    uploadMessage.style.color = isError ? "#f87171" : "#a5f3fc";
}

function renderEntryList() {
    entryList.innerHTML = "";

    entries.forEach((entry, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "entry-item";
        button.innerHTML = `
            <strong class="entry-item-title">${entry.title}</strong>
            <span class="entry-item-date">${entry.date || ""}</span>
        `;
        button.addEventListener("click", () => showEntry(index));
        entryList.appendChild(button);
    });
}

function showEntry(index) {
    const entry = entries[index];
    if (!entry) return;

    entryDisplay.innerHTML = `
        <article class="entry-content">
            <header>
                <h2 class="entry-title">${entry.title}</h2>
                <p class="entry-meta">${entry.date || ""}</p>
            </header>
            <div class="entry-body">
                ${entry.content.map((paragraph) => `<p>${paragraph}</p>`).join("")}
            </div>
        </article>
    `;

    const buttons = entryList.querySelectorAll(".entry-item");
    buttons.forEach((button, buttonIndex) => {
        button.classList.toggle("active", buttonIndex === index);
    });
}

function handleUpload() {
    const file = fileInput.files[0];
    const typedKey = uploadKeyInput.value.trim();

    if (typedKey !== UPLOAD_KEY) {
        showUploadMessage("Upload key invalid. Only use your personal key.", true);
        return;
    }

    if (!file) {
        showUploadMessage("Please choose a text or markdown file before uploading.", true);
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const uploadedEntry = parseEntryFile(reader.result, file.name);
        entries.unshift(uploadedEntry);
        saveEntries();
        renderEntryList();
        showEntry(0);
        showUploadMessage("Entry uploaded successfully.");
        fileInput.value = "";
        uploadKeyInput.value = "";
    };
    reader.onerror = () => {
        showUploadMessage("Unable to read the selected file.", true);
    };

    reader.readAsText(file);
}

window.addEventListener("DOMContentLoaded", () => {
    loadSavedEntries();
    renderEntryList();
    showEntry(0);

    uploadButton.addEventListener("click", handleUpload);
});
