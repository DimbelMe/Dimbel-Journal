const entries = [
    {
        title: "Morning Pages: Energy in Motion",
        content: [
            "Today I leaned into the rhythm of a slow morning and found that the first draft of an idea always feels quieter than expected.",
            "I took notes by hand, then built the outline digitally before returning to the pen. It helped keep the creative energy moving without losing the shape of the thought.",
            "Each entry feels less like a log and more like a way to make the small daily shifts visible. That's the thing I want this journal to be.",
        ],
    },
    {
        title: "Design Patterns for Slow Work",
        content: [
            "A strong layout is not only about visual balance, it's also about giving the reader a place to begin and a place to return.",
            "I experimented with a right-hand panel for navigation and a larger reading area on the left, which makes the experience feel more contemplative.",
            "Consistency in spacing and typographic hierarchy allows the page to breathe, even when the content is dense.",
        ],
    },
    {
        title: "Why Entry-Based Pages Work",
        content: [
            "Breaking content into discrete entries makes it easier to choose what to focus on without overwhelming the page.",
            "The navigation panel can be a simple list, but it plays a huge role in helping visitors discover and revisit entries.",
            "A clean, centered reading panel with a strong title gives each post enough room to feel important.",
        ],
    },
];

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
