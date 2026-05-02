const fs = require("fs");
const path = require("path");

const postsDir = path.join(__dirname, "../posts");
const outputFile = path.join(__dirname, "../posts.json");

const files = fs.readdirSync(postsDir);

const posts = files
  .filter(file => file.endsWith(".md"))
  .map(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    // Extract title from frontmatter
    const titleMatch = content.match(/title:\s*["']?(.*?)["']?\n/);

    return {
      title: titleMatch ? titleMatch[1] : file.replace(".md", ""),
      slug: post.slug,
      slug: file.replace(".md", "")
    };
  });

fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));