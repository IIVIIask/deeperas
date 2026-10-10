<p align="center"><img src="docs/assets/mark.svg" width="68" alt="Deeperas logo"></p>
<h1 align="center">Deeperas</h1>
<p align="center"><strong>Better answers begin with clarity.</strong></p>
<p align="center">A portable AI skill that guides your assistant to clarify intent,<br>check available evidence, and deliver work that fits your request.</p>
<p align="center"><a href="https://iiviiask.github.io/deeperas/">Explore the website</a> · <a href="#installation">Install</a> · <a href="#for-power-users">For power users</a> · <a href="https://github.com/IIVIIask/deeperas/issues">Feedback</a></p>

---

## What is Deeperas?

You ask your AI to build a website. It starts writing code. But did you want a product page, a booking site, or a portfolio?

Deeperas gives your assistant a clarification workflow: ask **one useful question at a time**, explain the meaningful options, and settle choices before work depends on them. Facts the assistant can investigate should come from its available tools and sources.

When your request is already clear, or you explicitly delegate a decision, the assistant should proceed. You do not need to prepare a perfect prompt first.

### A quick example

> **You:** Help me build a website.
>
> **Deeperas:** What should visitors be able to do?
>
> **A.** Understand your product and try it — a product page with a clear next step.
>
> **B.** Find and book your services — a service page built around enquiries.
>
> **C.** Explore your work — a portfolio that puts your projects first.
>
> **You:** A. A product page, for people new to the tool.

This is an illustrative conversation, not a captured test result. Deeperas can ask further questions if important decisions remain.

## Installation

Use a recent version of your host with plugin or Agent Skills support. Deeperas adds one instruction-based skill; it does not require a separate Deeperas service, API key, or MCP server.

### Codex

Run with the Codex CLI:

```sh
codex plugin marketplace add IIVIIask/deeperas
codex plugin add deeperas@deeperas
```

Start a new conversation and say:

```text
Use Deeperas to help me plan a website for my project.
Ask me about the choices that matter before you build it.
```

For a local checkout, clone this repository, open it as a trusted project, and use its marketplace at `.agents/plugins/marketplace.json`. You can also add the local checkout with `codex plugin marketplace add /absolute/path/to/deeperas` and install `deeperas@deeperas`. Follow your host's plugin installation prompts.

A fresh installation from this public repository was checked in an isolated Codex home, and the installed skill matches the release source. See [OpenAI's plugin packaging guide](https://developers.openai.com/plugins/build/plugins).

### Cursor

**Repository installation:** open **Customize**, choose **From GitHub Repository**, add `https://github.com/IIVIIask/deeperas`, then install **Deeperas**. Start a new Agent conversation and invoke `/deeperas` or ask the assistant to use Deeperas.

**Local skill alternative:** [download the repository ZIP](https://github.com/IIVIIask/deeperas/archive/refs/heads/main.zip), extract it, and copy the folder `plugins/deeperas/skills/deeperas/` to either:

| Location | Availability |
| --- | --- |
| `.cursor/skills/deeperas/SKILL.md` | This project |
| `~/.cursor/skills/deeperas/SKILL.md` | Your local user |

`~` means your home directory. Create the folders if needed. In Agent chat, type `/deeperas` to invoke the skill. Your version may show repository import under plugin settings; use the local skill option when repository import is unavailable.

The repository includes `.cursor-plugin/marketplace.json` and a Cursor manifest beside the portable plugin. These follow [Cursor's plugin reference](https://cursor.com/docs/reference/plugins) and [Agent Skills guide](https://cursor.com/docs/skills). An actual Cursor installation and conversation test is still pending.

## Using it

Describe your goal in ordinary language. Answer a question by choosing an option or replying in your own words. You can also delegate a particular decision:

```text
Use Deeperas. Help me plan this feature.
Choose the visual style for me, but ask before deciding the user flow.
```

To end questions for the current request, say:

```text
Answer now with what you can support from the information available.
```

That does not select a missing target or authorize an external action. The assistant should provide supported results and identify the remaining limits.

Good uses include planning projects, defining a feature, comparing approaches, researching a question, or working through connected requirements. For a vague creation idea, the instructions first check whether you want to begin planning.

## For power users

### The workflow

1. **Clarify:** resolve explicit alternatives and material uncertainty. Keep settled choices unless new evidence changes them.
2. **Verify:** investigate discoverable facts with available files, tools, and sources. Separate evidence from assumptions.
3. **Deliver:** answer or act only where the required choices and permissions are established. Verify artifacts and resulting state before claiming completion.

Project decisions can be staged: later choices remain pending until the work needs them. Independent work may continue while a question is open, provided every plausible answer leaves its inputs and method unaffected.

### What is inside?

```text
deeperas/
├── .agents/plugins/marketplace.json   # Codex repository marketplace
├── .cursor-plugin/marketplace.json   # Cursor repository marketplace
├── plugins/deeperas/
│   ├── plugin.json                   # Portable Agent Plugins manifest
│   ├── .codex-plugin/plugin.json     # Codex display and discovery metadata
│   ├── .cursor-plugin/plugin.json    # Cursor display and discovery metadata
│   └── skills/deeperas/SKILL.md       # The shared, original skill
├── docs/                             # Static GitHub Pages website
└── tests/site.test.mjs                # Package, site, and copy-button checks
```

The shared skill is **R22**, version `0.2.20+codex.20261010r22`. The website shows the shorter label `v0.2.20`. The skill's instructions are preserved from the existing plugin; this repository adds presentation and distribution metadata.

Read [the full skill](plugins/deeperas/skills/deeperas/SKILL.md) to inspect its actual rules.

### Project decision records

In Codex projects, Deeperas calls for a small `Deeperas_Decisions.txt` that records confirmed decisions, constraints, and pending issues. In a Git project, the instructions require the file to be untracked and demonstrably ignored before writing it. If that cannot be established, decisions remain in the conversation. The record does not create a global memory service or guarantee confidentiality or backup.

### Host-specific controls

| Control | ChatGPT | Codex / Cursor |
| --- | --- | --- |
| Ordinary-language clarification and delegation | Defined by the skill | Defined by the skill |
| “Answer now…” | Ends questions for the current cycle | Ends questions for the current cycle |
| Bare `X` | Supported-results shortcut | No special meaning |
| Bare `List` after a final answer | Reusable prompt from gathered requirements | No special meaning |

These are instruction-defined behaviors, not new buttons or platform commands. This GitHub repository is direct distribution; it is not a claim of approval or listing in the public OpenAI or Cursor directories.

### Boundaries and privacy

The package contains instructions and manifests, with no Deeperas backend, custom MCP server, hooks, or telemetry implementation. Your host still processes conversations and may access files, browse, or call tools under its existing settings and permissions.

Deeperas does not provide browsing or verification capabilities by itself. Its results depend on the host, model, available evidence, and instruction following. It cannot guarantee accuracy or override platform rules.

## Website and checks

The site is buildless HTML, CSS, and JavaScript. GitHub Pages serves `docs/` from the `main` branch. No dependency installation is required.

```sh
node --test tests/site.test.mjs
python -m http.server 4173 --directory docs
```

Open `http://localhost:4173` to preview the site. The tests check distribution paths, consistent plugin versions, local links, and both clipboard success and failure behavior.

To report a problem, [open an issue](https://github.com/IIVIIask/deeperas/issues) with your host, version, prompt, expected behavior, and actual behavior. Remove private information before posting.

## License

[MIT](LICENSE) · Copyright © 2026 IIVIIask. You may use, modify, and redistribute the plugin, including commercially, while retaining the copyright notice and license.
