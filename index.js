// plugin-sqlite-mcp
// Queries a local SQLite database.
// Grant requested: comment-task (the plugin only ever returns comment operations).

const MCP_SERVER_KEY = "sqlite";
const MCP_SERVER_CONFIG = {
  "command": "uvx",
  "args": [
    "mcp-server-sqlite",
    "--db-path",
    "./data/app.db"
  ]
};
const SETUP_STEPS = [
  "Point --db-path at the database file inside the workspace.",
  "Add the entry to the workspace MCP configuration.",
  "The agent sandbox mounts the workspace read-write; keep the file inside it."
];
const DOCS_URL = "https://www.npmjs.com/package/mcp-server-sqlite";
const MAX_COMMENT_LENGTH = 10000;

function asString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
}

export function buildSetupComment(event) {
  const lines = [];
  lines.push("### SQLite MCP — workspace configuration");
  lines.push("");
  lines.push("This workspace has the **SQLite MCP** plugin installed.");
  lines.push("It installs and configures the SQLite MCP server: the agent can then inspect and query SQLite files, prototype schemas and run data checks without any server.");
  const title = asString(event && event.taskTitle);
  if (title) {
    lines.push("");
    lines.push("Task: **" + title + "**");
  }
  lines.push("");
  lines.push("Add this entry to the workspace `mcp.servers` configuration:");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify({ [MCP_SERVER_KEY]: MCP_SERVER_CONFIG }, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("**Setup**");
  for (let i = 0; i < SETUP_STEPS.length; i++) {
    lines.push((i + 1) + ". " + SETUP_STEPS[i]);
  }
  lines.push("");
  lines.push("Docs: " + DOCS_URL);
  let text = lines.join("\n");
  if (text.length > MAX_COMMENT_LENGTH) {
    text = text.slice(0, MAX_COMMENT_LENGTH - 3) + "...";
  }
  return text;
}

export async function taskCreated(event) {
  const text = buildSetupComment(event);
  if (!text) return [];
  return [{ type: "comment", value: text }];
}

export const hooks = {
  "task.created": taskCreated,
};
