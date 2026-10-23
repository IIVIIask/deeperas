<p align="center">
  <img src="plugins/deeperas/assets/icon.png" alt="Deeperas: a blue D with inward depth" width="96" height="96">
</p>

# Deeperas

**Make your AI clarify what matters before it acts.**

[![Codex](https://img.shields.io/badge/Codex-2563eb?style=flat-square)](INSTALL.md#codex)
[![Cursor](https://img.shields.io/badge/Cursor-2563eb?style=flat-square)](INSTALL.md#cursor)
[![Claude Code](https://img.shields.io/badge/Claude_Code-2563eb?style=flat-square)](INSTALL.md#claude-for-windows)
[![Latest release](https://img.shields.io/github/v/release/IIVIIask/deeperas?style=flat-square&color=2563eb)](https://github.com/IIVIIask/deeperas/releases/latest)
[![MIT license](https://img.shields.io/badge/license-MIT-2563eb?style=flat-square)](LICENSE)
[![Package checks](https://github.com/IIVIIask/deeperas/actions/workflows/package-checks.yml/badge.svg?branch=main&event=push)](https://github.com/IIVIIask/deeperas/actions/workflows/package-checks.yml)

Deeperas helps Codex turn vague requests into clear tasks. It guides the agent to clarify decisions that matter, inspect available project context, and follow your agreed direction before changing files or starting implementation. The same skill also works in Cursor and Claude Code, including the Code tab in Claude for Windows.

Describe what you want to build, change, or investigate. Deeperas asks one focused question when an important choice is missing, using explained options when helpful. Clear requests, delegated choices, and advice with enough context can proceed directly.

**Version** `0.2.76` · **Skill revision** R65 · [What changed](CHANGELOG.md) · [Update](INSTALL.md#updating-an-existing-installation)

[Install](#installation) · [Real case](#example) · [How it works](#how-it-works) · [Power users](#for-power-users) · [FAQ](#faq)

---

## Installation

All hosts receive the same skill. Use a recent host version with plugin support. See [what was tested](INSTALL.md#tested-with).

### Codex

Requires the [Codex CLI](https://learn.chatgpt.com/docs/cli). Run the commands below in your terminal.

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

Start a new Agent conversation and select `/deeperas`. For ongoing use, choose **Use as Mode** where supported.

Prefer to copy the skill into a project? See the [installation guide](INSTALL.md), which also covers updating.

### Claude Code

**Claude for Windows, Code tab:** Open **Customize → Plugins → Add plugin → Add marketplace**, add `https://github.com/IIVIIask/deeperas`, then add **Deeperas**. See the [desktop installation guide](INSTALL.md#claude-for-windows) for details.

**Claude Code:** Run these commands in your terminal:

```sh
claude plugin marketplace add IIVIIask/deeperas
claude plugin install deeperas@deeperas
```

Start a new Code session and use `/deeperas:deeperas`.

### Calling Deeperas

Ask for Deeperas by name, or select it explicitly: `$deeperas` in Codex CLI, `@Deeperas` in the Codex app, `/deeperas` in Cursor, or `/deeperas:deeperas` in Claude Code and the Windows Code tab.

Your app controls when the skill is loaded. See [Cursor message and session use](INSTALL.md#using-deeperas-in-cursor) and [activation troubleshooting](INSTALL.md#troubleshooting).

## Example

### A real case: simplifying this README in Codex

The owner asked whether the documentation had become excessive, then requested a cleanup with approval before each change. The work was broken into small, reviewable edits.

**One approved instruction**, translated from the original Greek:

> Shorten “How it works”, keep Clarify, Verify, Deliver unchanged, and link to the advanced guide instead of the two detailed paragraphs. Then ask me about the next change.

**The published result:** the three steps stayed intact, and two explanatory paragraphs became links to the detailed guide. [Inspect the actual diff.](https://github.com/IIVIIask/deeperas/commit/22e7c7d47a85da525e610bd904ff8e30f17241aa)

The same cleanup also shortened [Calling Deeperas](https://github.com/IIVIIask/deeperas/commit/9e60136), simplified [For power users](https://github.com/IIVIIask/deeperas/commit/0e32641), and removed [a technical FAQ already covered by the install guide](https://github.com/IIVIIask/deeperas/commit/db23e862581e85886b5918e0e5ff425208d5fcaf).

This is a real task from October 15, 2026, summarized from the owner's conversation and linked commits. It shows scoped changes and approval boundaries, not a controlled comparison or a measured time saving.

## When to use it

In Codex, Cursor and Claude Code, use Deeperas when an unresolved choice could change the work:

- **Plan a feature**: Clarify the goal, intended users, and scope before planning implementation.

- **Investigate a bug**: Inspect available code and error evidence, and clarify expected behavior when it is unclear.

- **Refactor code**: Agree on the scope and behavior to preserve before changing the structure.

- **Choose an implementation approach**: Investigate the project constraints and clarify your priorities before recommending an approach.

Answer in your own words, choose an option, or delegate a decision. Clear tasks can proceed directly. The same workflow also applies to writing, research, and planning outside software projects.

## How it works

**1. Clarify.** Ask one focused question about the most consequential unresolved choice, and explain what each option means. Important preferences are never decided silently.

**2. Verify.** Investigate discoverable facts with the available files, tools, and sources. Ask you only about your intent, not about things the assistant can look up itself.

**3. Deliver.** Answer or act once the choices the work depends on are settled. Check the result before claiming completion, and say what the evidence does not establish.

See [project decisions and dependencies](docs/POWER-USERS.md#project-work-and-dependencies) and [the clarification gate](docs/POWER-USERS.md#the-clarification-gate).

### What's new in 0.2.76

Install the same R65 skill in **Claude for Windows and Claude Code**, alongside Codex and Cursor. This release adds Claude packaging and installation instructions; the core instructions, references and memory helper are unchanged.

The R65 workflow includes:

- **Keep the thread across follow-ups.** An unanswered requirement stays open when the conversation moves to another question. Settled, independent requests can still proceed.
- **Separate requirements from preferences.** Hard constraints, personal priorities and evidence strength are handled separately when comparing approaches.
- **More focused responses.** Explain decisions through the task, without unnecessary recaps or internal-rule quotations. Keep the evidence and limits needed to assess the answer.
- **Clear work can move forward.** Explicit requests, delegated choices and supported advice do not need an extra interview or an unrequested plan.

R65 organizes the complete core into 65 condition/action rules. The six topic references and optional local memory helper are retained; memory remains off by default. This describes the intended workflow, not a measured advantage over every earlier version. [Release history](CHANGELOG.md) · [Versioning policy](docs/POWER-USERS.md#release-version-naming).

## For power users

**Start using it**

> “Use Deeperas to help me plan this change.”

**Delegate a particular choice**

> “Choose the visual style for me, but ask about the user flow.”

**End the questions for this request**

> “Answer now with what you can support.”

**Stop using the workflow**

> “Stop using Deeperas for this task.”

“Answer now” ends questions without filling in missing choices, waiving verification, or authorizing external actions. See [delegation and ending questions](docs/POWER-USERS.md#delegation-and-ending-questions).

Project memory is optional and **off by default**. It needs explicit permission for the specific project and verified local file/tool access. Normal use needs no memory setup. See [how project memory works](docs/POWER-USERS.md#living-project-memory).

Explore the [power-user guide](docs/POWER-USERS.md), including [the skill bundle](docs/POWER-USERS.md#the-skill-bundle). For manual installation, [copy the complete skill folder](INSTALL.md#as-a-local-skill).

## FAQ

<details>
<summary><strong>Will it interview me about everything?</strong></summary>

No. It asks when a missing fact or choice could materially change the work. Clear requests, explicitly delegated choices, and supported advice can proceed directly. When you are undecided, it helps compare the alternatives. [More about the clarification gate.](docs/POWER-USERS.md#the-clarification-gate)

</details>

<details>
<summary><strong>Do I need to know how to code?</strong></summary>

No. After installation, describe your goal in normal language. Answer in your own words or pick an option. The workflow is not limited to software projects.

</details>

<details>
<summary><strong>Does it need an API key or another service?</strong></summary>

Deeperas needs no separate API key or account. Your AI host supplies the model and tools under its own settings. There is no Deeperas backend, MCP server, hooks, or telemetry. Only the optional local memory helper needs Node.js, Git verification, and permitted file/process access. [Privacy and requirements.](docs/POWER-USERS.md#boundaries-and-privacy)

</details>

<details>
<summary><strong>Does it update automatically?</strong></summary>

Supported team/workspace marketplaces can sync from GitHub automatically. Personal installations may need a marketplace refresh or a manual folder replacement. See [updates and automatic sync](INSTALL.md#updating-an-existing-installation) for your host.

</details>

<details>
<summary><strong>Does it guarantee correct answers?</strong></summary>

No. Verification depends on the tools and evidence your host makes available. Model behavior varies, and the skill cannot override platform rules. The package checks validate the distribution and helper, not universal model adherence.

</details>

## Feedback and contributions

[Report a problem](https://github.com/IIVIIask/deeperas/issues/new?template=bug_report.yml) using the **Bug report** form: include your application and versions, a small example, and the expected versus actual result. Remove private information before posting.

Changes to the instructions should come with an example that makes the intended behavior easy to judge. Published usage cases should come from actual work, with sources and edits disclosed. Keep generated demonstrations and test replays clearly identified. For the local checks, see [development](docs/POWER-USERS.md#development).

## License

[MIT](LICENSE) · Copyright © 2026 IIVIIask.
