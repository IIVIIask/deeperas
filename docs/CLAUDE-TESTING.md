# Claude compatibility checks

Deeperas `0.2.76`, skill revision R65. Checked on October 23, 2026. The [paired evaluation](#paired-evaluation-r65-r66-and-r67) below covers the earlier unpublished `0.2.77` / R66 and R67 revisions. The current R74 development revision is tracked [separately](#r74-explanations-when-needed).

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

## Paired evaluation: R65, R66 and R67

Run on October 23, 2026 with Claude Code 2.1.308 in print mode, Opus 5.5 at xhigh effort. Every conversation started fresh in an empty folder, with all other plugins, hooks and MCP servers disabled in both conditions. ON began the first message with `/deeperas:deeperas`; OFF disabled the plugin. R66 and R67 were loaded with `--plugin-dir` while the installed R65 plugin was disabled. The saved sessions confirmed the expected revision in every ON run and no Deeperas text in any OFF run.

There were twenty English scenarios: 14 underspecified requests with hidden user facts and 6 complete requests. A blind simulated user (Opus 5.5) saw only its fact card and answered only explicit questions. A blind judge (Opus 5.5) compared each ON/OFF pair in random order, with the activation prefix removed, against written acceptance criteria.

| Series | Pairs | ON wins | OFF wins | Ties | Judge score ON / OFF | Criteria met ON / OFF | User replies ON / OFF |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R65 | 60 (3 runs) | 20 | 29 | 11 | 6.7 / 6.9 | 81% / 81% | 2.0 / 1.0 |
| R66 | 20 (1 run) | 15 | 1 | 4 | 8.8 / 6.8 | 99% / 80% | 0.8 / 0.8 |
| R66, held-out | 20 (1 run) | 10 | 5 | 5 | 8.2 / 7.1 | 93% / 78% | 0.8 / 1.0 |
| R67, second held-out | 20 (1 run) | 13 | 3 | 4 | 8.4 / 6.9 | 92% / 81% | 0.9 / 1.1 |

For R65 the difference was not significant: the sign test gave p = 0.25, and the scenario-level 95% interval for the score difference ran from -1.1 to +0.6. For R66 the sign test gave p = 0.001 and the interval ran from +1.2 to +2.9. Across the R65 runs, ON invented no user facts while OFF invented 14. In the R66 run the judge recorded one minor ON fabrication (the baby's sex) and none for OFF.

**Held-out check.** After R66 was fixed, a separate agent that had not seen R66 or these findings wrote 20 new scenarios (H01 to H20) in the same format: 14 underspecified and 6 complete, on different topics. Byte-identical R66 then ran once against a fresh OFF baseline with the same simulator and judge. R66 won 10, lost 5 and tied 5. On the 14 underspecified requests it won 10, lost 3 and tied 1. Its mean judge score was 7.8 against 6.1 (95% interval for the difference +0.2 to +3.2), and it met 90% of criteria against 69%. On the 6 complete requests, both met every criterion: 4 ties and 2 one-point OFF wins, where the judge preferred the more concise answer. Across all 20, the sign test on wins gave p = 0.30, so the held-out win count alone is not significant. The held-out gain is real but smaller than the in-sample one.

R66 final answers were longer than the baseline's (616 against 415 words on the held-out underspecified requests), and the judge penalized length on complete requests. The losses also show remaining inventory gaps: one plan never asked where a bike would be stored at home.

**R67 and a second held-out set.** R67 was written after reviewing the R66 conversations on both earlier sets. It widens the situation check (what prompted the request and what was tried, others affected including pets, where the result is used or kept, how things stand now), keeps later question rounds for dependent or substantive gaps, asks for the shortest complete answer built from the user's own details, and uses neutral wording for unconfirmed specifics. Another agent, which had seen neither R67 nor these findings, then wrote 20 more scenarios (N01 to N20) on new topics. R67 ran once on them against a fresh OFF baseline. It won 13, lost 3 and tied 4 (sign test p = 0.021; mean judge score 8.4 against 6.85, 95% interval for the difference +0.7 to +2.4). On the 14 underspecified requests it won 12 and lost 2, with a mean score of 8.0 against 5.8 and 89% of criteria met against 72%. On the 6 complete requests it won 1, lost 1 and tied 4. OFF invented 4 user facts and R67 none. R67 answers were still longer than the baseline's (433 against 325 words on underspecified requests), but shorter than R66's on its held-out set (616 against 415). The R66 and R67 held-out sets differ, so their comparison is indirect.

R65 asked one question per turn, often stopped after the first answer, and sometimes spent its questions on abstract framing instead of the user's figures, constraints or prior experience. R66 asks independent questions together, checks the user's situation before asking, and answers complete requests directly. In the R66 run, the only loss was the sales-chart scenario, where both answers met every criterion and the judge preferred the shorter OFF answer.

Limits:

- **In-sample and held-out.** R66 was written after reviewing the original R65 pairs and their hidden facts; the held-out set is the fairer estimate.
- **One run per R66 and R67 set.** The R65 runs varied substantially (8 to 8, 5 to 12 and 7 to 9 in ON and OFF wins).
- **Simulated-user slips.** In the original R66 run the judge flagged four pairs where the simulated user added an unasked fact: three favoring ON and one favoring OFF. Excluding them gives 12 ON wins, 0 OFF wins and 4 ties. In the held-out run, slips favored OFF in two pairs and ON in two; excluding the three flagged pairs gives 8 ON wins, 4 OFF wins and 5 ties. Longer question lists gave the simulated user more chances to slip: in the R67 run the judge flagged eight pairs, mostly minor. Excluding the three where a slip could have decided the pair for ON gives 10 ON wins, 3 OFF wins and 4 ties; excluding all eight gives 5, 3 and 4.
- **Evaluator choices.** The evaluator wrote the scenarios, and the judge is a model. Claude Code supplied the account email in both conditions, and commands requiring approval were denied in both.
- **Frozen suites.** The device-choice and continuation behavioral suites expect one question per ASK turn. R66 intentionally changed that format, so those expectations need a revised rubric. They were not rerun for R66 or R67.

The scenario cards, simulator and judge prompts, transcripts and judgments are kept in the local verification workspace, not in this repository.

## R68 one-question restoration

R68 restores one focused question per turn and rechecks unresolved material prerequisites after each reply. This is the owner-approved first correction to the development branch; the other review findings remain pending. Package version `0.2.77` is still unpublished.

Only rules R032, R034, R035 and R038, the discovery text and revision marker differ from R67. The [frozen R67 core](../tests/fixtures/deeperas-r67-core.txt) preserves the exact instructions used in the earlier evaluations. The R66/R67 statistics above must not be presented as R68 results.

All 37 package, rule-integrity and isolated memory tests passed on Windows on October 23, 2026. The R68 scope check confirms that every other R67 rule, all six references and the helper remain unchanged. These automated checks do not establish model adherence.

The existing one-question behavioral fixtures remain historical evidence. Restoring that format does not establish a pass for R68; a new model evaluation of the corrected revision is still pending.

## R69 materiality by consequences

R69 applies the second approved correction: judge a gap by its consequences for correctness, constraints, user choices, risk and acceptance, rather than the size or ease of the resulting edit. It retains direct answers when one supported result covers every plausible answer without violating constraints or selecting a reserved choice.

Only R024 and the revision marker differ from the [frozen R68 core](../tests/fixtures/deeperas-r68-core.txt). The one-question workflow and the other 64 rules, discovery text, all six references and the optional helper are unchanged. Package `0.2.77` remains unpublished, with the other review findings pending.

All 38 package, rule-integrity and isolated memory tests passed on Windows on October 23, 2026. The Claude Code plugin validator also passed. These checks establish package consistency and the approved change scope, not model adherence.

No new R69 model evaluation has been run. Historical R66/R67 statistics do not establish R69 behavior or improvement.

## R70 explaining inspected evidence

R70 applies the third approved correction: explain the relevant finding and provide a usable reference when referring to inspected files, tool results or checks, without assuming the user has already seen them.

Only the approved wording in R038 and the revision marker differ from the [frozen R69 core](../tests/fixtures/deeperas-r69-core.txt). The rest of R038, the other 64 rules, discovery text, all six references and the optional helper are unchanged. Package `0.2.77` remains unpublished, with the other review findings pending.

All 39 package, rule-integrity and isolated memory tests passed on Windows on October 23, 2026. The Claude Code plugin validator also passed. These checks establish package consistency and the approved change scope, not model adherence.

No new R70 model evaluation has been run. Historical R66/R67 statistics do not establish R70 behavior or improvement.

## R71 help after "don't know"

R71 applies the approved correction for "don't know": explain relevant options or verify discoverable facts, then ask one simpler question only when it can resolve a remaining material prerequisite. It must not repeat the same question without additional help.

Only the approved wording in R034 and the revision marker differ from the [frozen R70 core](../tests/fixtures/deeperas-r70-core.txt). "No preference" delegation, the restriction on questions after a delivered result, the rest of R034, the other 64 rules, discovery text, all six references and the optional helper are unchanged. Package `0.2.77` remains unpublished, with the other review findings pending.

All 40 package, rule-integrity and isolated memory tests passed on Windows on October 23, 2026. The Claude Code plugin validator also passed. These checks establish package consistency and the approved change scope, not model adherence.

No new R71 model evaluation has been run. Historical R66/R67 statistics do not establish R71 behavior or improvement.

## R72 early answers only on request

R72 applies the approved display correction: do not offer "Answer now" or equivalent early-answer options or unsolicited reminders. Explicit user requests for an early answer in natural language remain supported under the unchanged R031 rule.

Only the approved addition to R038 and the revision marker differ from the [frozen R71 core](../tests/fixtures/deeperas-r71-core.txt). The restriction on questions after a delivered result, the rest of R038, the other 64 rules, discovery text, all six references and the optional helper are unchanged. Package `0.2.77` remains unpublished. The previous proposed correction remains pending.

All 41 package, rule-integrity and isolated memory tests passed on Windows on October 23, 2026. The Claude Code plugin validator also passed. These checks establish package consistency and the approved change scope, not model adherence.

No new R72 model evaluation has been run. Historical R66/R67 statistics do not establish R72 behavior or improvement.

## R73 necessary follow-up questions

R73 applies the approved correction for necessary follow-up questions: after delivering a result, allow one necessary question for unfinished requested work or a continuation the user requested. It must not append optional refinements or generic offers to a completed task. Scoped stopping and requests that end questions remain binding; when no further question is appropriate, state any material unresolved limit briefly.

Only the approved final wording in R034 and the revision marker differ from the [frozen R72 core](../tests/fixtures/deeperas-r72-core.txt). The rest of R034, the other 64 rules, discovery text, all six references and the optional helper are unchanged. Package `0.2.77` remains unpublished. Final behavioral validation and review of comparative evidence remain pending.

All 42 package, rule-integrity and isolated memory tests passed on Windows on October 23, 2026. The Claude Code plugin validator also passed. These checks establish package consistency and the approved change scope, not model adherence.

Codex testing on October 24, 2026 covered 10 unique scenarios. A fresh paired comparison with published R65 yielded 11 tied scenario pairs and two favoring R65, both repeats of the same explanation-of-options case. No pair favored R73. These targeted results do not demonstrate general superiority. Desktop R73 smoke tests covered calculation, a necessary question, a requested preliminary answer and working code citations; they used a local skill and GPT-6 Astra High, separately from the gpt-6.1-sol medium CLI comparison. Cursor and Claude were not retested for R73.

## R74 explanations when needed

R74 changes only the approved context-length wording in R034 and the revision marker. It allows the minimum explanation needed when the user does not understand the alternatives, in an initial request or a later reply. One question at a time and the other R73 instructions remain unchanged.

Focused Codex comparison on October 24, 2026 used 18 fresh conversations (20 assistant turns), eight unique scenarios and one repeat, with Codex CLI 0.164.0-alpha.11.1, gpt-6.1-sol and medium reasoning for both arms. Prompts and criteria were frozen before execution; one reviewer scored revision-masked text before revealing the labels. This was not independent double-blind review.

R74 explained the local-only/sync difference in both repetitions of the original uncertainty scenario; R73 omitted it in both. Overall: one pair favored R74, eight tied and none favored R73. R73 had seven passes and two partials; R74 had eight passes and one partial. The R74 partial combined who would use the tracker and which devices they need, so the one-question requirement is not fully reliable. No further instruction change was applied.

Both revisions passed four controls where extra explanation was unnecessary: a known-options question, missing billing interval, sorted table and translation. Host-required skill-use progress notices were assessed separately from final answers. All 43 package, rule-integrity and isolated-memory checks passed. See the [prompts, exact final answers, criteria and results](../tests/fixtures/deeperas-r74-codex-evaluation.json).

These results support a narrow improvement in explaining options when needed, not general superiority or a minor-version promotion. R74 desktop UI, Claude and Cursor behavior were not retested. Package `0.2.77` remains unpublished and unmerged.

[Installation](../INSTALL.md#claude-for-windows) · [Back to the README](../README.md)
