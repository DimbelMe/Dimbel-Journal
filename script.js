let entries = [];

async function fetchEntries() {
  const res = await fetch("/posts.json");
  const data = await res.json();

  // Load markdown content for each post
  entries = await Promise.all(
    data.map(async (post) => {
      const mdRes = await fetch(`/posts/${post.slug}.md`);
      const text = await mdRes.text();

      // Remove frontmatter
      const content = text.replace(/---[\s\S]*?---/, "");

      return {
        title: post.title,
        content: [content] // keep your structure compatible
      };
    })
  );
}

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
        button.addEventListener("click", () => {
            history.pushState(null, "", `#${entry.slug}`);
            showEntry(index);
        });
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
                ${marked.parse(entry.content[0])}
            </div>
        </article>
    `;

    const buttons = entryList.querySelectorAll(".entry-item");
    buttons.forEach((button, buttonIndex) => {
        button.classList.toggle("active", buttonIndex === index);
    });
}

window.addEventListener("DOMContentLoaded", async () => {
  await fetchEntries();
  renderEntryList();

  const hash = window.location.hash.replace("#", "");

  if (hash) {
    const index = entries.findIndex(e => e.slug === hash);
    if (index !== -1) {
      showEntry(index);
      return;
    }
  }

  showEntry(0);
});

window.addEventListener("popstate", () => {
  const hash = window.location.hash.replace("#", "");

  const index = entries.findIndex(e => e.slug === hash);
  if (index !== -1) {
    showEntry(index);
  }
});