<p align="center">
  <img src="plugins/deeperas/assets/icon.png" alt="Deeperas — a blue D with inward depth" width="96" height="96">
</p>

# Deeperas

**Ask what matters. Check the evidence. Then do the work.**

Deeperas is a skill for the AI assistant in Codex and Cursor. It makes the assistant understand what you want before it commits to an answer or starts building.

You describe the idea. The assistant finds the choices that actually change the result and asks about them one focused question at a time, with each option explained. It looks up facts it can check itself instead of asking you, and it proceeds as soon as the direction is clear.

Already know exactly what you want? Say it. Want the assistant to choose for you? Delegate that decision. Clear tasks get done without an interview.

**Version** `0.2.48+20261014r42` (skill revision R42) · [Changelog](CHANGELOG.md) · [Update an existing installation](INSTALL.md#updating-an-existing-installation)

[Install](#installation) · [Example](#example) · [How it works](#how-it-works) · [Power users](#for-power-users) · [FAQ](#faq) · [MIT license](LICENSE)

---

## Installation

Both hosts receive the same skill. Use a recent host version with plugin support. See [what was tested](INSTALL.md#tested-with).

### Codex

```sh
codex plugin marketplace add IIVIIask/deeperas --ref main
codex plugin add deeperas@deeperas
```

Start a new conversation, then ask:

```text
Use Deeperas to help me plan my project.
Ask me about the choices that matter before you start building.
```

### Cursor

Open **Customize → + Add → From GitHub Repository**, enter the URL below, then add **Deeperas**:

```text
https://github.com/IIVIIask/deeperas
```

Start a new Agent conversation and type `/deeperas`, or ask the assistant to use Deeperas.

Prefer to copy the skill into a project? See the [installation guide](INSTALL.md), which also covers updating.

### Calling Deeperas

Ask for it by name, for example “Use Deeperas to help me plan this,” or select it explicitly: `$deeperas` in Codex CLI, `@Deeperas` in the Codex app, `/deeperas` in Cursor. Once active, it stays active for related follow-ups until you stop it or move to unrelated work.

If the workflow does not start, select the installed skill explicitly and begin a new conversation. Your host decides which skills it loads; a name typed in a message is not a guarantee. Deeperas is only the packaged instructions. It needs no separate service, account, or API key.

## Example

The prompt sounds simple:

> Help me plan a page for my plugin.

But “a page” can mean different things, and a rushed assistant picks one and starts writing. Deeperas surfaces that choice first:

> **Where should people read it?**
>
> **A. Inside the GitHub repository** — a README with installation, examples, and documentation.
>
> **B. On a standalone website** — a separate presentation page for visitors.
>
> **C. Both** — a website and repository documentation, with a shared explanation.

Choose **A**, and the assistant has a concrete direction. It may ask about the audience or another decision that matters, then it produces the work.

*Illustrative example, not a captured model response.*

## When to use it

| You want to… | Deeperas guides the assistant to… |
| --- | --- |
| Plan a project or a feature | Establish the goal, audience, constraints, and the decisions the next step depends on. |
| Compare approaches | Separate your preferences from facts it can investigate. |
| Research a question | Check the available evidence and make the remaining gaps clear. |
| Work through a complex request | Keep settled choices, track dependencies, and revisit only what new evidence changes. |

It works through ordinary conversation: choose an option, answer in your own words, or delegate the decision. It is useful beyond coding. Writing, research, planning, and everyday decisions all involve unclear intent.

## How it works

**1. Clarify.** Ask one focused question about the most consequential unresolved choice, and explain what each option means. Important preferences are never decided silently.

**2. Verify.** Investigate discoverable facts with the available files, tools, and sources. Ask you only about your intent, not about things the assistant can look up itself.

**3. Deliver.** Answer or act once the choices the work depends on are settled. Check the result before claiming completion, and say what the evidence does not establish.

In a project, decisions are staged. The goal and critical constraints come first; later decisions are asked just before the work needs them. Independent work can continue while a question is open, as long as the answer cannot change that work's inputs or method.

Answering one question settles only that gap. If another missing condition changes which method is suitable, the assistant clarifies it before recommending the method or giving steps.

## For power users

| What you want | What to say |
| --- | --- |
| Start using it | “Use Deeperas to help me plan this change.” |
| Delegate a particular choice | “Choose the visual style for me, but ask about the user flow.” |
| End the questions for this request | “Answer now with what you can support.” |
| Stop using the workflow | “Stop using Deeperas for this task.” |

“Answer now” ends the questions. It does not fill in missing targets, waive verification, or grant permission for external actions. The assistant returns what it can support and explains the remaining limits.

The skill is one [core file](plugins/deeperas/skills/deeperas/SKILL.md) plus five topic references in `references/`. The plugin installs all six; when copying manually, copy the whole skill folder.

The [power-user guide](docs/POWER-USERS.md) explains activation, the clarification gate, project decision records, host-specific controls, the [reference files](docs/POWER-USERS.md#the-skill-bundle), and verification boundaries.

## FAQ

<details>
<summary><strong>Can I copy just SKILL.md?</strong></summary>

No. The core needs the matching `references/` folder. Plugin installation includes it automatically. For a manual installation, copy the entire `deeperas` skill folder as described in the [installation guide](INSTALL.md).

</details>

<details>
<summary><strong>Will it interview me about everything?</strong></summary>

No. It asks only about meaningful uncertainty and about alternatives you named but did not choose. A clear request or an explicitly delegated choice proceeds directly. For a vague creation idea, it first checks whether you want to start planning at all.

</details>

<details>
<summary><strong>Do I need to know how to code?</strong></summary>

No. After installation, describe your goal in normal language. Answer in your own words or pick an option. The workflow is not limited to software projects.

</details>

<details>
<summary><strong>Does it need an API key or another service?</strong></summary>

No. Deeperas is instructions and plugin manifests only: no server, no MCP server, no hooks, no telemetry. Your AI host still runs the model, conversation, files, and tools under its own settings and permissions.

</details>

<details>
<summary><strong>Does it update automatically?</strong></summary>

Supported team/workspace marketplaces can sync from GitHub automatically. Personal installations may need a marketplace refresh or a manual folder replacement. See [updates and automatic sync](INSTALL.md#updating-an-existing-installation) for your host.

</details>

<details>
<summary><strong>Does it guarantee correct answers?</strong></summary>

No. Verification depends on the tools and evidence your host makes available. Model behavior varies, and the skill cannot override platform rules.

</details>

## Feedback and contributions

[Open an issue](https://github.com/IIVIIask/deeperas/issues) with your host and version, a small example prompt, and what you expected versus what happened. Remove private information before posting.

Changes to the instructions should come with an example that makes the intended behavior easy to judge. For the local checks, see [development](docs/POWER-USERS.md#development).

## License

[MIT](LICENSE) · Copyright © 2026 IIVIIask.
