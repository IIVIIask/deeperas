# Deeperas for power users

Deeperas is an instruction-based workflow with an optional local project-memory helper. The host interprets the skill and supplies the model, tools, and permissions. The skill ships a [complete core](../plugins/deeperas/skills/deeperas/SKILL.md), [six topic references](#the-skill-bundle) and the helper. Its package version is `0.2.77`, skill revision R66.

## Activation and the first response

The skill recognizes a request to use Deeperas through a selected mention, a literal `@deeperas`, or natural language such as “use Deeperas” or “with the help of Deeperas,” including ordinary spelling variations in English and Greek. Quoted material, discussion of the name, and a request to disable it do not activate the workflow. The workflow is designed to continue through related follow-ups until you disable it or move to unrelated work. The host controls whether its instructions stay available.

These instructions apply when the host makes the skill available and loads it. They do not install a global router or guarantee that a host selects the skill from a plain-text name. When activation is uncertain, select the skill explicitly: `$deeperas` in Codex CLI, `@Deeperas` in the Codex app, `/deeperas` in Cursor, or `/deeperas:deeperas` in Claude Code. In Claude chat or Cowork, select it from the `/` menu. The package is the workflow itself, not a separate service requiring a connection.

Claude for Windows imports the same skill through its plugin menu. Claude Code uses `.claude-plugin/plugin.json` and namespaces the skill under its plugin name. Neither route adds a second instruction core. Chat, Cowork and Code have different tool and file access, so the available verification and optional memory capabilities depend on the active host. See [Claude desktop installation](../INSTALL.md#claude-for-windows) and [Claude Code installation](../INSTALL.md#claude-code).

In Cursor, selecting `/deeperas` with **Enter** attaches it to one message. For session use, choose **Use as Mode** from the skill's `/` menu entry in the **Agents Window or Cursor CLI** to start a **Custom Mode**. The instructions then stay in context on every turn until you exit the mode. This controls context availability; it does not guarantee model adherence. See [Cursor activation](../INSTALL.md#using-deeperas-in-cursor) and [Cursor's Custom Modes guide](https://cursor.com/docs/agent/prompting#custom-modes).

When material context needed for the requested result or action is missing, the clarification gate applies before research or the first answer. An ASK turn lists every independent material question together as a short numbered list, most consequential first. Questions that depend on earlier answers wait for the next turn. Before asking, the assistant checks what a personal result needs: the goal, the people involved and their needs, hard limits, the user's own figures and resources, what they already have or know, required specifics, and format. Relevant explanations, examples or small diagrams may accompany the list, with the pending questions briefly restated after the explanation. A "don't know" is not asked again in another form, a delivered result does not end with a new request for information, and a request that already states its deliverable and governing facts is answered without a question. Explanations do not select unresolved alternatives or authorize dependent recommendations or steps. Personal “best method” requests need the configuration, resources, and intended use that can change the recommendation. General explanations remain general, and host-required immediate safety guidance still takes precedence.

## Rules in one complete core

R66 keeps the complete shared workflow in `SKILL.md` as 65 rules with stable IDs, activation conditions and actions. A shared contract defines events, precedence, the ASK/ANSWER gate and dependency handling. Only applicable rules run; the rule list is not an interview checklist. The host model interprets these instructions. There is no separate deterministic rules engine or mandatory JSON parser.

Hard constraints are checked before preference ranking. Unknown compliance stays unverified. Comparisons use the user's actual priorities, without invented percentages or equal weights. An ordinary preference such as “cost matters more” does not mean every small saving wins regardless of effort; the assistant asks about a decisive unresolved trade-off. Numeric scores require explicit weights and comparable utility scales. Unknown performance is not zero, and preference scores cannot override a hard requirement.

Importance percentages alone do not convert raw prices, time, reliability or other measurements into comparable utilities. The next question should resolve the concrete trade-off the user needs, without demanding a complete scoring framework when one comparison is enough. Established dominance or bounds can settle a choice without gathering irrelevant preferences; shared variables and correlations must be preserved. A qualitative recommendation cannot supply a missing user priority.

Changed evidence is traced to affected dependencies and output claims. Valid completed checks are reused; required post-action inspection, freshness checks and memory-operation safeguards still apply. The workflow avoids unrequested hypothetical subtrees while preserving every branch needed for the requested comparison or completeness. Reading a topic reference adds its applicable checks, not an unrequested plan or another inventory of already established resources. Answers omit purposeless repetition, while retaining the reasoning, sources and limits needed to assess the result.

The R64 continuation behavior remains: unanswered material prerequisites stay open across unrelated answers, while explicitly general or independent settled requests receive direct answers. All six specialized references and the optional helper remain unchanged. Reference and memory guards apply before the operation that needs them.

This is an instruction structure change, not a speed guarantee. Reuse a complete current reading while its text, relevant inputs and evidence remain available and unchanged. See the [changes since R42](../CHANGELOG.md#changes-since-the-previous-public-release-r42).

## The clarification gate

The assistant asks about material, unselected alternatives before dependent output or action. Only immaterial, low-risk, easily reversible details may be selected within the user's allowed alternatives; it still asks when materiality is uncertain or the user reserves the choice. Such selections are assistant choices, not user acceptance or preferences. Otherwise, it asks when plausible answers would materially change the result, such as the target, scope, constraints, method, or intended audience.

Clear tasks and explicitly delegated choices proceed directly. Minor cosmetic polish alone does not need a question.

For an informational factual question or calculation, a small set of relevant, supported cases can answer directly without selecting an interpretation. Label each case's scope, status and uncertainty; retain material alternatives and evidence limits. Ask when evidence or coverage is insufficient, useful cases cannot be bounded, an explicit clarification-first request applies, or the result/action needs one confirmed interpretation. This exception does not authorize recommendations, actions or a document/record filled with one unconfirmed value.

Requested advice can be delivered without accepting a proposed method when material facts, constraints and priorities are established. The recommendation includes its rationale, trade-offs and evidence limits. Missing prerequisites still require clarification; recommendations and "don't know" replies do not grant permission to apply a method.

For tool cost/fit comparisons, verify official-source facts about editions, licensing and deployment options that can materially change the conclusion under the confirmed goal and constraints. Investigate uncertain applicability before excluding a plausible option; unresolved material evidence still blocks dependent conclusions. A complete inventory is required when requested or when the conclusion needs that coverage, rather than as a table before every comparison. Cite decision-relevant evidence when the format permits, report coverage limits and verify total operating cost. Missing evidence alone does not establish that an option is absent.

A reply resolves the gap it answers. Under the shared recheck rule, unresolved user-owned conditions that can change the method or procedure still require clarification before dependent recommendations or steps. An unknown condition does not become an assumed fact, a conditional instruction to change it, or a check appended after the recommendation.

Each clarification focuses on one decision. Ask directly for a simple necessary fact or value when that is clearer; use explained options when they help the user understand or make the decision. Labels and the usual 2-5 choices apply when a menu is used. Every substantive option still explains its consequences, all important alternatives remain available, and a recommendation depends on established priorities and evidence. You can answer with an option or in ordinary language. The pending-question reminder after an explanation remains in force.

Requests to explain an option or clarification receive the depth needed for understanding, without a two-sentence limit. After the explanation the assistant briefly restates the pending selection question. It repeats the full menu when requested, changed or needed for selection. The decision and prerequisites remain open; explanation is not acceptance or authorization. When answer-now has ended questions or no selection remains pending, the explanation adds no question.

Ordinary present-tense factual status queries use the host date when the context does not indicate another period or genuine time ambiguity. State that date when material and verify the state at that date. Existing historical context takes priority. This does not select an entity, product configuration, sports season, reporting window or date for a planned action; material gaps still require clarification.

## Project work and dependencies

A clear request for help with creation, organization or planning is consent to begin the requested discussion. The assistant asks the most consequential substantive question when a material prerequisite is missing; it does not first ask whether to start planning. If the user merely mentions an idea and the desired help is unclear, it asks what assistance is wanted. Beginning discussion does not select governing choices, amend constraints or grant additional implementation or external-action authority.

Settle the goal and critical constraints first. Later decisions can remain pending until a step needs them. Deferring a choice does not allow the assistant to make it silently.

Work may continue independently while a question is open only when every plausible answer leaves that work's inputs and method unaffected. New evidence reopens the affected decisions; settled, unaffected choices remain intact.

Factual drafting, translation and rewriting preserve supplied meaning, status and certainty. A template convention or plausible implication does not establish another fact or commitment. Omit unsupported additions when the requested text remains complete; ask only for facts necessary to complete it. The existing final recheck compares introduced or strengthened material claims with their evidence without a separate full review.

When the user is undecided, help evaluate material alternatives using established goals and constraints instead of simply repeating the unresolved selection. Load the planning reference before decision support that needs its specialized checks. A staged proposal must preserve material alternatives; verify transition requirements, effort and costs before calling later expansion easy. Adoption still requires actual user selection or delegation. Independent preparation may proceed under the existing independent-work rule; do not block it solely because no implementation path is yet verified. Distinguish preparation from implementing an unverified path.

One shared recheck covers the material choices and their origins, permissions, constraints, prerequisites, assumptions, contradictions and evidence needed by the next question, answer, plan, recommendation or dependent action. Reuse a completed check only while its relevant inputs, evidence validity and scope are unchanged. A reply, attachment, tool result/failure, correction, conflict or draft insight triggers identification of changes and rechecking of affected facts, choices, branches and dependencies. Expiry, relevant elapsed time and changed files, sources or configuration also invalidate affected checks. Preserve other branches only when they are demonstrably unaffected; uncertain impact requires checking all potentially affected branches.

Required tool verification, memory read/check operations, artifact inspection and freshness checks remain mandatory within their existing authorization and capability conditions. Before sending, confirm that the shared check covers the final wording, claims, local fact/source bindings and branch statuses; check new or changed draft content and reopen the gate if a material gap appears.

Domain guidance is loaded for list universe/time/completeness checks, exact product identity/configuration/matches, existence/absence judgments, causal claims and food safety/quality/storage judgments. A domain mention in general advice, conceptual planning or ordinary drafting alone does not trigger it. Questions, options or claims that depend on specialized checks still require the complete applicable guidance first.

## Delegation and ending questions

Explicit delegation applies to the choice you name:

```text
Choose the visual style for me, but ask before deciding the user flow.
```

“Answer now with what you can support” ends the questions for the current cycle. It does not select an unspecified target, waive verification, or grant permission. The assistant returns supported results and describes the unresolved limits.

## Project decision records

Existing Codex `Deeperas_Decisions.txt` records are retained as legacy context containing confirmed decisions, constraints, and pending issues. Reading or updating them requires explicit project-specific authorization covering that memory use/recovery. While memory is OFF, the record is left unread and unchanged. New structured memory uses the helper below; the old prose record is neither overwritten nor automatically imported. Neither record may contain secrets, hidden reasoning, raw logs, or unaccepted proposals presented as decisions.

For Git projects, the skill requires the record to be untracked and ignored through the repository's private `info/exclude` file before writing it. The host resolves that file with `git rev-parse --git-path info/exclude` and verifies the matching rule with `git check-ignore -v`. A shared `.gitignore` or a global ignore rule does not satisfy this requirement.

If the record is already tracked, or the private exclusion cannot be verified, the assistant stops file persistence and keeps decisions in the conversation. It does not remove or untrack an existing record by implication. The record is project context, not a global memory service or authorization for future actions. Local storage guarantees neither confidentiality nor backup.

## Living project memory

Persistent project memory is **OFF by default**. Enable it only after explicit project-specific user authorization to save or recover durable context is established in the current conversation or trusted host context. Reuse established authorization within its confirmed scope; existing files, tools, planning consent, saved entries and approval of a policy change do not activate memory by themselves. For example, “Remember confirmed decisions for this project across chats” authorizes project-specific saving. Do not interrupt ordinary tasks to request activation.

After authorization, verify complete applicable memory references, an identified project directory, permitted durable file access and process execution, Node.js, the bundled [helper](../plugins/deeperas/skills/deeperas/scripts/project-memory.mjs), and Git privacy. If the instructions or a capability are unavailable or cannot be verified, persistent memory is **disabled**. While OFF, do not read either memory store, invoke the helper, or create/update memory, lock, temporary or Git-exclusion files. Disabling memory preserves existing files and does not authorize deletion. Ordinary clarification, verification and current-conversation context still work; no cross-conversation recovery is claimed. Disclose a limitation when requested memory use/recovery cannot proceed.

The helper creates `.deeperas/memory.json` inside the actual project. In Git it first verifies that the whole `.deeperas` directory is untracked and excluded through the repository's private `info/exclude`. This covers the ledger, lock and temporary files. It preserves existing exclusion rules and does not change shared `.gitignore` or global settings.

Each entry has a stable ID, kind (`fact`, `decision`, `constraint`, `result`), literal value, state (`confirmed`, `unknown`, `conflicted`, `stale`), provenance and dependencies. Provenance contains its kind, an actual evidence reference and an observation time. Confirmed decisions require a user selection/delegation reference; calculations require input dependencies. The host must inspect the evidence: schema validation does not establish its truth. Optional `validUntil` deadlines invalidate expiring evidence on the next access, without background monitoring.

For project-local file evidence, provenance can also include `file: {path, sha256}` using the actual hash of the inspected bytes. The helper rejects a mismatched hash before confirmation and invalidates dependent entries when the file changes, disappears or becomes unreadable. Paths cannot escape the identified project. A matching hash proves byte identity; it does not prove that a claim correctly describes those bytes.

Correcting an input marks dependent conclusions stale, transitively. Old values remain visibly stale and unrelated entries stay unchanged. The assistant must recompute calculations, re-evaluate decisions and repair authorized artifacts before confirming those results again. Unverified or stale inputs cannot pass a readiness check. Repeating an unchanged entry does not invalidate its dependents.

The helper accepts one JSON request on stdin:

```text
node <installed-skill-directory>/scripts/project-memory.mjs --project <absolute-project-directory>
```

Only within established project-memory authorization and after capability/privacy verification, use host process tools with separate argument/input fields, or an input file, rather than shell-interpolating user data. Start with `{"action":"read"}`. A `put` uses the returned `expectedRevision` and an entry with `dependsOn` as entry IDs; the helper captures their revisions. While memory is ON, use `{"action":"check","ids":["input","result"]}` for all material dependencies before dependent output/action; while OFF, verify dependencies with current conversation and actual task evidence without helper calls. Returned `enabled` verifies storage capability, not user authorization; `blocked` means requested entries are not ready; `disabled`/`error` means persistent use must stop until an authorized successful read/reconciliation. A revision conflict is never permission to blindly replay a stale write. The host must enforce the authorization gate before invoking the unchanged helper.

No authorization or file tools means no helper invocation or substitute storage. The helper also provides an adapter operation, `{"action":"disable"}`, that returns disabled without accessing a project; this does not waive the host's authorization gate or require a call while OFF. Corrupt, wrong-project or tracked stores are preserved. A leftover lock prevents writes and requires inspection rather than automatic deletion. See the [full memory workflow](../plugins/deeperas/skills/deeperas/references/project-memory.txt).

## The skill bundle

The complete core defines the shared clarification gate and essential safeguards, and requires available matching topic references in full before work in those areas. Project work, conversation-only context, provenance tracking, corrections and resuming alone do not trigger the two memory references. Existing project-specific memory authorization remains valid within its confirmed scope. Requests to inspect, explain or edit the instructions may load them as task evidence without activating memory:

| Reference | When it is needed |
| --- | --- |
| [Constraint conflicts](../plugins/deeperas/skills/deeperas/references/constraint-conflicts.txt) | Accepted requirements conflict, or a change needs the responsible person's authority. |
| [Idea to plan](../plugins/deeperas/skills/deeperas/references/idea-to-plan.txt) | Before proposing or evaluating methods, detailed plans, resource allocations, feasibility, cost/fit, editions or licensing, including questions/options that need its specialized checks. A goal or requirement question fully supported by the core alone does not trigger it. |
| [Domain checks](../plugins/deeperas/skills/deeperas/references/domain-checks.txt) | Relevant product, sports/list, causal, and food questions. |
| [Artifact enforcement and recovery](../plugins/deeperas/skills/deeperas/references/artifact-enforcement-recovery.txt) | Before artifact construction, layout, conversion or repair needing specialized structural, count, boundary, fit or recovery checks, including dependent questions/options/plans. General business advice, decision support, ordinary chat drafting and conceptual/staged planning do not trigger it by themselves. |
| [Project decisions in Codex](../plugins/deeperas/skills/deeperas/references/project-decisions-codex.txt) | Explicitly authorized persistent-memory use in Codex, before any store access or helper operation. |
| [Living project memory](../plugins/deeperas/skills/deeperas/references/project-memory.txt) | Explicitly authorized project-specific persistent-memory saving or recovery in any host, before any store access or helper operation. |

Keep all six topic files under `references/` beside the complete `SKILL.md`, using files from the same release. Missing, unreadable or partial topic guidance does not by itself stop work supported by the core. Disclose the limitation when it affects the requested procedure, quality or completion, and never reconstruct missing rules or claim to have followed them. Stop a dependent step if necessary prerequisites, authorization, safety checks or acceptance criteria cannot be established; only already authorized demonstrably unaffected work may continue. Preserve confirmed constraints and unrelated work, enforce and verify construction/layout criteria, and never claim unsupported feasibility, completeness, absence, safety, recovery or completion. Persistent memory remains OFF without complete applicable memory references and the other authorization/capability/privacy requirements.

## Host-specific controls

| Control | ChatGPT | Codex / Cursor / Claude |
| --- | --- | --- |
| Ordinary-language clarification and delegation | Defined by the skill | Defined by the skill |
| “Answer now…” | Ends questions for the current cycle | Ends questions for the current cycle |
| Bare `List` after a final answer | Reusable prompt from gathered requirements | No special meaning |

Custom answers can be written directly, and ordinary-language requests can end questions or request a reusable summary in every host. There are no single-letter exit or custom-answer controls. In ChatGPT/Work, List remains available, but invitations appear only when shortcut reminders are requested and the response is suitable for one. The request applies within its confirmed task scope; the assistant does not ask whether to enable reminders.

These are instruction-defined behaviors, not new platform buttons. This repository provides direct distribution; it does not claim approval or listing in the public OpenAI, Cursor or Anthropic directories.

## Package structure

```text
deeperas/
├── README.md                         # Main presentation and quick start
├── INSTALL.md                        # Detailed host installation instructions
├── CHANGELOG.md                      # Changes since the previous release
├── docs/POWER-USERS.md               # Detailed behavior and boundaries
├── .agents/plugins/marketplace.json  # Codex repository marketplace
├── .cursor-plugin/marketplace.json   # Cursor repository marketplace
├── .claude-plugin/marketplace.json   # Claude repository marketplace
├── plugins/deeperas/
│   ├── plugin.json                  # Portable manifest and OpenAI presentation
│   ├── .codex-plugin/plugin.json    # Same interface for older Codex versions
│   ├── .cursor-plugin/plugin.json   # Cursor display and discovery metadata
│   ├── .claude-plugin/plugin.json   # Claude manifest using the same skill folder
│   ├── assets/                      # Blue icon and light/dark README logos
│   ├── LICENSE                      # Notice retained in installed packages
│   └── skills/deeperas/
│       ├── SKILL.md                 # Complete shared core instructions
│       ├── references/              # Six topic files
│       └── scripts/project-memory.mjs # Optional local persistence helper
└── tests/                           # Distribution and memory behavior checks
```

The root manifest supplies the OpenAI presentation through `extensions.com.openai.interface`; `.codex-plugin/plugin.json` carries the same interface for older Codex versions. Cursor and Claude have their own manifests and receive the same skill and icon artwork. Claude Code does not render listing icons in its terminal; newer Anthropic listing surfaces can use the Claude manifest's `icon` field.

### Release version naming

Use one plain semantic version everywhere: `MAJOR.MINOR.PATCH`, currently `0.2.77`. The GitHub tag is `v0.2.77` and the plugin archive is `deeperas-0.2.77.zip`. Keep the root manifest, all three host manifests, documentation and published package synchronized. Version strings and filenames must not include host names.

The skill revision is separate: this release is presented as **0.2.77 · R66**, and its core retains the `Deeperas Precision - Plugin R66` marker. Revisions continue as R67, R68 and so on; they do not reset when the package series changes. A packaging-only change can keep the same instruction revision.

| Change | Version policy |
| --- | --- |
| Correction or revision within the current series | Increase the patch, for example `0.2.77` to `0.2.78`. |
| Substantial evolution with demonstrated improvement in the agreed evaluation | Increase the minor series, for example `0.2.x` to `0.3.0`. |
| A stable release meeting explicitly agreed readiness criteria | Consider `1.0.0`. Do not infer readiness from the number alone. |

The improvement requirement is a project release policy, not a guarantee supplied by SemVer. Before promoting a series, agree on the comparison cases, success criteria and comparable host/model settings. Record the observed improvement, failures and regressions, and link the evidence in the changelog. Passing package tests alone is insufficient. Without that evidence, keep the current series and increment its patch.

Older published versions used date and instruction-revision build metadata. Keep those historical names unchanged. The move to `0.2.75` remains newer than the previous public `0.2.71+20261015r63` and the local `0.2.74+20261022r65`; no downgrade or second public version label is needed.

## Boundaries and privacy

The package contains instructions, manifests and the optional local Node.js helper, with no Deeperas backend, custom MCP server, hooks or telemetry. Your host still processes conversations and may use local files or external tools according to its settings and permissions. The helper does not contact a network service.

Deeperas does not add browsing or verification tools by itself. Results depend on the host, the model, the available evidence, and instruction following. It cannot guarantee accuracy or override platform rules.

## Development

Node.js and Git must be available. No dependency installation is needed:

```sh
node --test tests/*.test.mjs
```

The [Package checks workflow](../.github/workflows/package-checks.yml) runs this command on every push and pull request. The README badge reports the latest push result for `main`.

The checks cover:

- Matching marketplaces, manifest versions, skill revision and documented version.
- All six topic references, the optional helper, MIT notice and shared square icon.
- The repository writing rule and removal of retired controls from active instructions and guides.
- Memory persistence, provenance, file hashes, corrections, dependency invalidation, expiry and readiness in isolated temporary projects.
- Git privacy, corrupt or tracked stores, concurrent revisions, write failure and restart recovery.
- Exact approved instruction changes against the frozen R64 [historical fixtures](../tests/fixtures), including R63's single-core restoration and R64's continuation check. The historical baseline is reconstructed before checking earlier changes.
- The 65 rule IDs, condition/action records, internal references, unchanged discovery metadata and specialized files, and integrity of the frozen comparative behavioral suite. Structural checks do not grade model decisions.

The full instruction-change history is in the [changelog](../CHANGELOG.md). Historical fixtures are comparison evidence, not additional active instructions. Static opt-in assertions do not make the helper enforce user consent internally; the host must enforce authorization before calling it.

Frozen text hashes normalize CRLF to LF before comparison so Windows and Linux checkouts verify the same content. This does not normalize other text changes or binary assets.

On Windows, sandbox restrictions may require permission for temporary Git repositories and atomic file replacement. A denied privacy or storage check must disable memory, never weaken its persistence rules.

These tests validate the distribution and helper. They do not establish universal model adherence, current Cursor behavior, automatic managed-workspace sync, or a speed or quality advantage. Report host behavior with the application/version, exact prompt, and expected versus actual result. Keep generated tests and replayed inputs clearly identified; public real-use cases need traceable work and disclosed edits.

[Back to the README](../README.md) · [Installation](../INSTALL.md)
