const entryList = document.getElementById("entry-list");
const entryDisplay = document.getElementById("entry-display");

function renderEntryList() {
    entries.forEach((entry, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "entry-item";
        button.innerHTML = `
            <strong class="entry-item-title">${entry.title}</strong>
        `;
        button.addEventListener("click", () => showEntry(index));
        entryList.appendChild(button);
    });
}

function showEntry(index) {
    const entry = entries[index];
    entryDisplay.innerHTML = `
        <article class="entry-content">
            <header>
                <h2 class="entry-title">${entry.title}</h2>
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

window.addEventListener("DOMContentLoaded", () => {
    renderEntryList();
    showEntry(0);
});
