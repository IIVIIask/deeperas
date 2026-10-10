# Deeperas for power users

Deeperas is an instruction-based workflow. The host interprets its skill and supplies the model, tools, and permissions. Read the [complete skill](../plugins/deeperas/skills/deeperas/SKILL.md) for the exact rules.

## The clarification gate

The assistant resolves explicit, unselected alternatives before dependent output or action. Otherwise, it asks when plausible answers would materially change the result, such as the target, scope, constraints, method, or intended audience.

Clear tasks and explicitly delegated choices should proceed directly. Minor cosmetic polish alone does not need a question.

Each clarification focuses on one decision. Options explain their consequences, and a recommendation should depend on established priorities and evidence. You can answer with an option or in ordinary language.

## Project work and dependencies

Settle the goal and critical constraints first. Later decisions can remain pending until a step needs them. Deferring a choice does not allow the assistant to silently make it.

Work may continue independently while a question is open only when every plausible answer leaves that work's inputs and method unaffected. New evidence should reopen the affected decisions, while settled, unaffected choices remain intact.

## Delegation and ending questions

Explicit delegation applies to the choice you name:

```text
Choose the visual style for me, but ask before deciding the user flow.
```

“Answer now with what you can support” ends questions for the current cycle. It does not select an unspecified target, waive verification, or grant permission. The assistant should return supported results and clearly describe unresolved limits.

## Project decision records

In Codex projects, the instructions call for a small `Deeperas_Decisions.txt` containing confirmed decisions, constraints, and pending issues. It should not contain secrets, hidden reasoning, raw logs, or unaccepted proposals presented as decisions.

For Git projects, the skill requires the record to be untracked and demonstrably ignored before writing it. If that cannot be established, decisions remain in the conversation. The record is project context, not a global memory service or authorization for future actions. Local storage does not guarantee confidentiality or backup.

## Host-specific controls

| Control | ChatGPT | Codex / Cursor |
| --- | --- | --- |
| Ordinary-language clarification and delegation | Defined by the skill | Defined by the skill |
| “Answer now…” | Ends questions for the current cycle | Ends questions for the current cycle |
| Bare `X` | Supported-results shortcut | No special meaning |
| Bare `List` after a final answer | Reusable prompt from gathered requirements | No special meaning |

These are instruction-defined behaviors, not new platform buttons. This repository provides direct distribution; it does not claim approval or listing in the public OpenAI or Cursor directories.

## Package structure

```text
deeperas/
├── README.md                         # Main presentation and quick start
├── INSTALL.md                        # Detailed host installation instructions
├── assets/deeperas.svg               # README banner
├── docs/POWER-USERS.md               # Detailed behavior and boundaries
├── .agents/plugins/marketplace.json  # Codex repository marketplace
├── .cursor-plugin/marketplace.json   # Cursor repository marketplace
├── plugins/deeperas/
│   ├── plugin.json                  # Portable Agent Plugins manifest
│   ├── .codex-plugin/plugin.json    # Codex display and discovery metadata
│   ├── .cursor-plugin/plugin.json   # Cursor display and discovery metadata
│   ├── LICENSE                      # Notice retained in installed packages
│   └── skills/deeperas/SKILL.md      # Shared skill instructions
└── tests/package.test.mjs            # Distribution checks
```

The published skill is **R22**, version `0.2.20+codex.20261010r22`. The instructions are preserved from that release; the manifests provide host-specific discovery and display metadata.

## Boundaries and privacy

The package contains instructions and manifests, with no Deeperas backend, custom MCP server, hooks, or telemetry implementation. Your host still processes conversations and may use local files or external tools according to its settings and permissions.

Deeperas does not add browsing or verification tools by itself. Results depend on the host, model, available evidence, and instruction following. It cannot guarantee accuracy or override platform rules.

## Development

No dependency installation is required for the package checks:

```sh
node --test tests/package.test.mjs
```

The checks verify that both marketplaces resolve to the same skill, manifests share a version, and the installable package retains the MIT notice. Document instruction changes with a small, judgeable example. Report host-specific behavior with the host name, version, prompt, and expected versus actual result.

[Back to the README](../README.md) · [Installation](../INSTALL.md)
