# Claude compatibility checks

Deeperas `0.2.76`, skill revision R65. Checked on October 23, 2026.

## Environment

- Claude for Windows **3.6556.1**, **Code** tab, local computer and an isolated project.
- Model shown by the app: **Opus 5.5**, **Extra** effort. Existing user customizations, including Ponytail, remained enabled. This was an integration check, not an isolated comparison of Deeperas alone.
- Separate Claude Code CLI **2.1.233** for manifest validation, component discovery and installation checks. Model responses were tested in the Windows app, not through this CLI.
- One shared R65 core, six references and the optional memory helper. All eight skill files match 0.2.75. No new hooks, agents or MCP servers.

## Observed checks

| Check | Observation | Result |
| --- | --- | --- |
| Package and isolated helper tests | All 34 Node tests passed on Windows. | Passed |
| Claude manifest and marketplace | Both validated. CLI 2.1.233 warns about the optional `icon` field, which older versions ignore. | Passed with warning |
| Plugin discovery | CLI and desktop found version 0.2.76 with one `deeperas` skill. | Passed |
| Icon packaging and display | The blue PNG is included and referenced. The Windows Code plugin manager displayed its generic plugin symbol instead of the custom icon. | Packaged; custom display not confirmed |
| Explicit invocation | The Windows Code session recognized `/deeperas:deeperas`. | Passed |
| Incomplete request | The owner's subscription-app request, translated into English, produced one device-choice question and paused before implementation. No answer was selected or submitted for the owner. | Passed for clarification and pause |
| Answer now | After stopping the pending test question, the follow-up ended the interview, described supported requirements and unresolved choices, and did not build the app. | Passed for ending questions |
| Closed translation | The original Greek request was translated directly, preserving the three requested capabilities without adding requirements or asking another question. | Passed |
| Scoped file change | Claude changed only the requested first line in the test README. Independent byte comparison confirmed that the remaining text and CRLF line endings were preserved. The app's manual permission prompts remained active. | Passed |

The subscription request and translation reuse the owner's actual words. The Answer now follow-up and one-line file edit are test controls written for this check. These are observed test runs, not a completed real-world app, a user testimonial or a benchmark.

## Limits and findings

The device question's option text tied device choice too strongly to a particular storage and sign-in design. This test does not establish those architectural claims. The check passes the narrow activation/clarification criteria, not every explanation in the answer. Deeperas is interpreted by the host model and does not guarantee factual accuracy or universal instruction adherence.

The test project contained no private user data. Project memory stayed off, and no memory-store creation was observed. Optional memory was covered by isolated helper tests, not by enabling it in the Claude session.

Claude chat, Cowork, automatic marketplace updates and every supported model were not tested. Adding a GitHub marketplace does not mean the plugin has been approved or listed in Anthropic's official directory.

[Installation](../INSTALL.md#claude-for-windows) · [Back to the README](../README.md)
