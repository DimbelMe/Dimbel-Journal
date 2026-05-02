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
        slug: post.slug,
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

function showHome() {
    entryDisplay.innerHTML = `
        <div class="home">
            <h2>Welcome</h2>
            <p>Select a story to read.</p>
        </div>
    `;

    const buttons = entryList.querySelectorAll(".entry-item");
    buttons.forEach(button => button.classList.remove("active"));
}

function goHome() {
    history.pushState(null, "", "#home");
    showHome();
}

window.addEventListener("DOMContentLoaded", async () => {
    document.querySelector(".site-title").addEventListener("click", goHome);
    await fetchEntries();
    renderEntryList();

    const hash = window.location.hash.replace("#", "");

    if (!hash || hash === "home") {
        showHome();
        history.replaceState(null, "", "#home");
        return;
    }

    const index = entries.findIndex(e => e.slug === hash);

    if (index !== -1) {
        showEntry(index);
    } else {
        showHome();
    }
});

window.addEventListener("popstate", () => {
  const hash = window.location.hash.replace("#", "");

  if (!hash || hash === "home") {
    showHome();
    return;
  }

  const index = entries.findIndex(e => e.slug === hash);

  if (index !== -1) {
    showEntry(index);
  }
});