const UPLOAD_KEY = "dimbel-upload-key";
let entries = [];

const entryList = document.getElementById("entry-list");
const entryDisplay = document.getElementById("entry-display");
const fileInput = document.getElementById("entry-file-input");
const uploadKeyInput = document.getElementById("upload-key");
const uploadButton = document.getElementById("upload-entry-btn");
const uploadMessage = document.getElementById("upload-message");

function showUploadMessage(message, isError = false) {
    if (!uploadMessage) return;
    uploadMessage.textContent = message;
    uploadMessage.style.color = isError ? "#f87171" : "#a5f3fc";
}

async function fetchEntries() {
    try {
        const response = await fetch("/api/entries");
        if (!response.ok) {
            throw new Error("Unable to fetch entries from server.");
        }
        entries = await response.json();
    } catch (error) {
        showUploadMessage("Server unavailable. Entries cannot be loaded.", true);
        console.error(error);
    }
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
    if (!entry) {
        entryDisplay.innerHTML = `
            <div class="entry-placeholder">
                <p>Select an entry from the list to read it here.</p>
            </div>
        `;
        return;
    }

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

async function handleUpload() {
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
    reader.onload = async () => {
        try {
            const response = await fetch("/api/entries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    key: typedKey,
                    fileName: file.name,
                    content: reader.result,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Upload failed.");
            }

            const newEntry = await response.json();
            entries.unshift(newEntry);
            renderEntryList();
            showEntry(0);
            showUploadMessage("Entry uploaded successfully.");
            fileInput.value = "";
            uploadKeyInput.value = "";
        } catch (error) {
            showUploadMessage(error.message, true);
            console.error(error);
        }
    };

    reader.onerror = () => {
        showUploadMessage("Unable to read the selected file.", true);
    };

    reader.readAsText(file);
}

window.addEventListener("DOMContentLoaded", async () => {
    await fetchEntries();
    renderEntryList();
    showEntry(0);

    uploadButton.addEventListener("click", handleUpload);
});
