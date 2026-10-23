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

## Device-choice regression

The [regression fixture](../tests/fixtures/deeperas-device-choice-cases.json) preserves the owner's original English subscription-app request and the evaluator-written Answer now control. Its expected criteria are kept outside the test project and are never sent to the answering model. Each repetition started a fresh Windows Code conversation with `/deeperas:deeperas`. No device choice was submitted for the owner.

**Reassessment, October 23, 2026:** the original blanket verdict that all three repetitions failed is withdrawn. After the owner challenged an overly strict treatment of implementation trade-offs, evaluation revision 2 was applied retrospectively to the same recorded answers. The original rubric, verdicts and transcripts were preserved in the local verification artifacts. This is a correction to the evaluation, not a new model run or evidence of improved model behavior.

The revised check distinguishes genuine constraints of a described implementation from unsupported universal requirements. Options may propose complete implementations and explain their trade-offs. A browser-local proposal may have browser-local storage limits, and an account-based cloud proposal may require its account. Including those attributes, or offering a synchronized two-device option, is not automatically an error or a user decision made without consent. Necessity must be judged in the full context of the actual proposal. Ambiguous wording is recorded as a concern rather than a confirmed factual failure.

These are manually graded model checks. Package checks validate the fixture's structure and safe file paths; passing them does not establish correct model behavior. The existing frozen R65 suite and all installed instructions remain unchanged.

Three repetitions were completed on October 23, 2026, in Windows app 3.6556.1 with Opus 5.5 Extra and Deeperas 0.2.76 / R65. Existing customizations, including Ponytail, remained enabled. Each run used the same isolated project containing only the fixture README.

| Repetition | Targeted reassessment | Answer now control | Project files |
| --- | --- | --- | --- |
| 1 | Wording concern, not a confirmed targeted error. The local-browser and shared-list routes can be read as proposed implementations. Saying device choice "decides" storage is too categorical, but does not by itself prove that all alternatives are ruled out. | Ended questions and selected no option. Separately corrected its initial assumption about averaging yearly prices. | Unchanged |
| 2 | Confirmed overstatement. The generic synchronized two-device option says it needs a backend with sign-in and cloud storage, without limiting that necessity to a defined account-based cloud proposal. | Ended questions and selected no option. It did not explicitly withdraw the first answer's overstatement; it did not repeat that exact necessity claim either. | Unchanged |
| 3 | No confirmed mandatory-login claim under this criterion. "With the same list on each" defines the proposed route; "such as" introduces hosting/cloud examples. The shared-location wording could be clearer, but does not establish a claim that every synchronization design requires login. | Ended questions, selected no option and explicitly left user accounts unassumed. | Unchanged |

The revised conclusion is one confirmed necessity overstatement and two cases without a confirmed violation of this targeted criterion. This is not a claim that two whole answers passed or that every technical detail is correct. Pausing before implementation and ending questions each passed in all three. Independent byte comparison confirmed that the original README remained the only project file.

The confirmed excerpt from repetition 2 is: "This needs a small backend with sign-in and cloud storage, which means more code, an account and a hosting service." For a concrete counterexample to universal cloud/account requirements, [Syncthing stores data on the participating devices and authenticates those devices](https://syncthing.net/), with [mutual device-ID configuration](https://docs.syncthing.net/intro/getting-started.html#configuring). This establishes that other synchronization architectures exist. It does not establish that Syncthing fits this subscription app or remove the need for access control.

**Instruction decision:** retain R65. The [existing core](../plugins/deeperas/skills/deeperas/SKILL.md) already requires verification of material factual claims and permits meaningful trade-offs; the [planning reference](../plugins/deeperas/skills/deeperas/references/idea-to-plan.txt) distinguishes requirements from methods. These observations do not establish a missing rule or show that an additional sentence improves behavior. The earlier broad addition to the option-explanation rule is withdrawn. No instruction change or new release is proposed on this evidence alone.

This reassessment covers the storage/login issue, including the Answer now controls. Other claims, such as phone installation requirements, reminder support or complete implementation feasibility, were not independently verified here. Existing customizations remained enabled, so the cause is not isolated to Deeperas.

[Installation](../INSTALL.md#claude-for-windows) · [Back to the README](../README.md)
