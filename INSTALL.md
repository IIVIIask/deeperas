# Install Deeperas

Deeperas works in a recent AI host with plugin or Agent Skills support. The current version is `0.2.77` (skill revision R66). Normal use needs no separate Deeperas account, API key, server or memory setup. See [what changed](CHANGELOG.md) and the [versioning policy](docs/POWER-USERS.md#release-version-naming).

The plugin includes the complete `SKILL.md`, six topic references and `scripts/project-memory.mjs`. Manual copies should retain this whole folder. Node.js, Git verification and permitted file/process access are required only for optional local memory; the host still supplies its own model and tools.

Use one method per host. Installing the plugin and a copied skill side by side duplicates the instructions.

## Codex

Requires the [Codex CLI](https://learn.chatgpt.com/docs/cli). Run the commands below in your terminal.

### From GitHub

```sh
codex plugin marketplace add IIVIIask/deeperas --ref main
codex plugin add deeperas@deeperas
```

Start a new conversation and say “Use Deeperas to help me plan this project.” If a plain-text request does not load it, mention the skill explicitly with `$deeperas` in Codex CLI or `@Deeperas` in the Codex app.

### From a local checkout

```sh
git clone https://github.com/IIVIIask/deeperas.git
cd deeperas
codex plugin marketplace add .
codex plugin add deeperas@deeperas
```

The marketplace file is `.agents/plugins/marketplace.json`. See [OpenAI's plugin guide](https://developers.openai.com/plugins/build/plugins) for marketplace details.

## Cursor

### As a plugin

1. Open **Customize**.
2. Choose **+ Add → From GitHub Repository**, enter `https://github.com/IIVIIask/deeperas`, and import it.
3. Find **Deeperas** and click **Add**.
4. Start a new Agent conversation and type `/deeperas`, or ask the assistant to use Deeperas.

The repository provides `.cursor-plugin/marketplace.json` and a Cursor plugin manifest. Menu labels vary between Cursor versions; if there is no repository import option, use the local skill method below.

### As a local skill

1. [Download the repository as a ZIP](https://github.com/IIVIIask/deeperas/archive/refs/heads/main.zip) and extract it.
2. Copy the whole folder `plugins/deeperas/skills/deeperas/`, including `references/` and `scripts/`, to one of these locations:

| Scope | Destination |
| --- | --- |
| One project | `.cursor/skills/deeperas/` |
| All your projects | `~/.cursor/skills/deeperas/` |

`~` is your home directory. Create the folders if they do not exist. Keep `SKILL.md`, all six topic references and the optional memory helper together. The complete core supports ordinary work on its own; unavailable topic guidance blocks steps whose necessary prerequisites or checks cannot be established. Keep the [MIT license notice](plugins/deeperas/LICENSE) with your copy.

Persistent project memory is OFF by default. Explicit authorization for the specific project must precede memory-store access or helper invocation, followed by verification of complete applicable memory references, permitted durable project files, process execution, Node.js and Git privacy. While OFF, existing stores are preserved unread and unchanged and the clarification workflow still works without activation prompts. Copying the helper or approving a policy change does not activate memory or grant tool/file permissions. See [living project memory](docs/POWER-USERS.md#living-project-memory).

Start an Agent conversation and type `/deeperas`.

See [Cursor's plugin reference](https://cursor.com/docs/reference/plugins) and [Agent Skills guide](https://cursor.com/docs/skills).

#### Check the copied skill revision

1. Open the copied `.cursor/skills/deeperas/SKILL.md` in your project, or `~/.cursor/skills/deeperas/SKILL.md` for a user-wide installation.
2. Find the `Deeperas Precision - Plugin R...` line near the top. Compare its `R` number with the **skill revision** at the top of this guide.

This identifies the core instruction revision, **not the plugin package version**. A matching marker does not prove that the other skill files match or that Cursor has loaded the skill. When updating, replace the entire skill folder with files from the same release.

### Using Deeperas in Cursor

- **One message:** Type `/`, find `deeperas`, then press **Enter** to attach it to that message.
- **Ongoing use:** In the **Agents Window or Cursor CLI**, choose **Use as Mode** from the skill's `/` menu entry to start a **Custom Mode**. The instructions stay available on each turn until you exit the mode.

To stop the workflow, say “Stop using Deeperas for this task.” Exit the mode as well to stop keeping the skill attached. See [Cursor's Custom Modes guide](https://cursor.com/docs/agent/prompting#custom-modes).

## Claude for Windows

These steps target the **Code tab** in Claude for Windows. Requires a Claude plan with Code access and a recent Claude desktop app. The same plugin contains the shared Deeperas skill, without a separate MCP server or desktop extension.

### From GitHub

1. Open the **Code** tab, then **Customize → Plugins**.
2. Choose **Add plugin → Add marketplace**, then the option to add from a repository.
3. Enter `https://github.com/IIVIIask/deeperas` and add the marketplace.
4. Find **Deeperas** in that marketplace and add it.
5. Start a new Code session in your project. Type `/` and select the Deeperas skill, or enter `/deeperas:deeperas` followed by your request.

Menu wording can vary by app version. See [Anthropic's plugin guide](https://support.claude.com/en/articles/13837440-use-plugins-in-claude).

### From the release ZIP

Download `deeperas-0.2.77.zip` from the [latest release](https://github.com/IIVIIask/deeperas/releases/latest). In **Customize → Plugins → Add plugin**, choose **Upload plugin** and select this ZIP. Use the plugin ZIP, not GitHub's whole-repository source archive. Keep one installation method to avoid duplicate skills.

Anthropic also supports skill plugins in chat and Cowork; those surfaces provide different file and tool access and are separate from this Code installation. Deeperas uses what the selected host permits. Optional local memory still requires explicit project-specific authorization and the verified local capabilities described in the [power-user guide](docs/POWER-USERS.md#living-project-memory).

## Claude Code

Run these commands in your terminal:

```sh
claude plugin marketplace add IIVIIask/deeperas
claude plugin install deeperas@deeperas
```

Start a new session and enter `/deeperas:deeperas`, followed by your request. Plugin skills use the plugin name as a prefix; `/deeperas` is the unprefixed command for a separately copied personal skill.

To try a checkout for one session without a permanent installation, run `claude --plugin-dir ./plugins/deeperas` from the repository root. The Claude manifest is `plugins/deeperas/.claude-plugin/plugin.json`; it points to the same `skills/` directory as the other hosts. See [Claude Code's plugin guide](https://code.claude.com/docs/en/plugins/create).

## Tested with

- **Claude Code 2.1.308, October 23, 2026.** Deeperas `0.2.77` / R66 loaded with `--plugin-dir` won 15 of 20 paired Opus 5.5 conversations against the same model without Deeperas (1 loss, 4 ties); R65 won 20 of 60 (29 losses, 11 ties). Those scenarios also informed R66. On 20 independently written held-out scenarios, R66 won 10, lost 5 and tied 5. All 35 package and isolated memory tests passed. See [the paired evaluation and its limits](docs/CLAUDE-TESTING.md#paired-evaluation-r65-and-r66).
- **Claude for Windows 3.6556.1, Code tab, October 23, 2026.** Deeperas `0.2.76` / R65 was discovered with one skill. Observed Opus 5.5 (Extra) checks covered explicit activation, clarification before implementation, Answer now, direct translation and a scoped file edit with byte verification. All 34 package and isolated memory tests passed. See [the test record and limits](docs/CLAUDE-TESTING.md), including an overgeneralized explanation in the device-choice test and the older CLI's optional-icon warning.
- **0.2.75 / R65 package validation, October 23, 2026.** All 34 package and isolated memory tests passed on Windows. They cover the portable and host manifests, complete skill bundle, icons, historical instruction changes, rule integrity and helper behavior. These checks do not establish a quality improvement over R63 or current model adherence in Cursor.
- **R64 validation, October 21, 2026.** All 30 package and isolated memory tests passed on Windows. Five isolated Codex scenarios covered 12 responses, including actual resumed cooler/HDD conversations and three clear-request controls. Both R63 and R64 passed this sample, so it does not establish a lower failure rate or universal adherence. Product facts in the comparison stages were supplied test data, not live purchase research.
- **R63 distribution, October 17, 2026.** All 29 package and isolated memory tests passed on Windows. They validate the published bundle and helper behavior, not model adherence or current Cursor runtime.
- **Earlier Codex install.** Version `0.2.48+20261014r42` installed from a local checkout on October 14, 2026. All six then-current skill files, the license notice, three PNGs, icon references, and the Website link matched the repository. This is historical R42 installation evidence, not a current R63 host test.
- **Cursor 3.24.12.** R33 was imported from GitHub on October 11, 2026. The blue D icon appeared in light and dark themes, and “Try in Chat” loaded the skill and returned a clarification question. The current R65 source has not been re-tested in Cursor.

The automated checks (`node --test tests/*.test.mjs`) verify manifests/version, all seven instruction files, the helper, license and icons, plus memory behavior in isolated temporary projects. They preserve historical changes from R42 through R64 and check R65's rule records, internal references, unchanged specialized files and frozen behavioral cases. Model adherence in each host requires separate observation.

## Updating an existing installation

GitHub is the distribution source. Updates reach installed users through their host's marketplace refresh or sync. Deeperas cannot force an update on every personal installation, and a GitHub release alone does not update copied files. Use a branch such as `main` to follow new versions; a fixed tag or commit stays pinned.

### Codex

Requires the [Codex CLI](https://learn.chatgpt.com/docs/cli). Run the commands below in your terminal.

```sh
codex plugin marketplace upgrade deeperas
codex plugin add deeperas@deeperas
```

The GitHub installation above tracks `main`; the upgrade command fetches the new package. Start a new conversation so it loads the updated instructions. If you pinned a Git ref, update the pin. See [OpenAI's marketplace guide](https://developers.openai.com/plugins/build/plugins).

For an existing local-checkout installation, first register the GitHub source with `codex plugin marketplace add IIVIIask/deeperas --ref main`. Confirm its source with `codex plugin marketplace list --json`. A marketplace still pointing at a local folder does not fetch GitHub changes by itself; preserve any development edits when switching sources.

For unattended personal updates, you can ask Codex to schedule a recurring check for this marketplace, compare package versions, run the two update commands when a newer version is available, and verify the installed version afterwards. This is a separate local automation that each user must enable. The plugin does not install a background updater or silently enable a schedule. Keep its source restricted to this repository and avoid downgrades; a new conversation is still needed after an update. Local scheduled checks require the computer to be on and the desktop app running; see [OpenAI's scheduled-task requirements](https://learn.chatgpt.com/docs/automations).

#### Check the installed version

```sh
codex plugin list --json
```

In `installed`, find the entry whose `name` is `deeperas`. Its `version` is the package version reported for this CLI environment. Compare it with `0.2.77`, the version at the top of this guide. The separate `R66` marker identifies the instruction revision; it is not part of the package version.

### Cursor plugin

For a **Teams or Enterprise marketplace**, an admin imports this repository in **Dashboard → Plugins & MCPs → Team Marketplaces**, then turns on **Enable Auto Refresh** in Marketplace Settings. Track `main`. This requires the Cursor GitHub App on the repository; pushes trigger re-indexing, batched at most once every ten minutes. **Refresh** requests a manual update. See [Cursor's update guide](https://prod.cursor.com/docs/plugins#keep-plugins-up-to-date).

For a personal import, use its marketplace refresh/update control if your version provides one. If it does not, use the complete copied-skill method above and replace that folder when updating. Personal imports are not promised automatic updates; the current Cursor update flow has not been tested.

#### Check the Cursor plugin version

1. Open **Customize**, then open **Deeperas** from your installed plugins.
2. Read the plugin version in its details and compare it with the package version at the top of this guide.

This is the plugin's declared package version, not the Cursor application version or a copied skill's `Plugin R...` revision. It does not confirm that a conversation has loaded the updated instructions. The version display is documented in [Cursor's release notes](https://prod.cursor.com/docs/release-notes).

### Claude

For a GitHub marketplace installation in Claude for Windows, use the marketplace and plugin refresh/update controls your app provides. An uploaded ZIP is a separate copy; update it with the new release ZIP. Publishing a GitHub release does not replace an uploaded copy automatically.

For a Claude Code marketplace installation, run:

```sh
claude plugin marketplace update deeperas
claude plugin update deeperas@deeperas
claude plugin list --json
```

Confirm that `deeperas@deeperas` is enabled and reports `0.2.77`, then start a new session. Native Claude Code marketplace auto-updates are controlled by the host and are off by default for third-party marketplaces. Deeperas does not create a background schedule. See [Claude Code's update guide](https://code.claude.com/docs/en/plugins/install#keep-plugins-updated).

Plugins added to your Claude account can also sync to Claude Code when signed in with the same account on a supported version. This requires Claude Code 2.1.273 or later; a separate older CLI installation does not gain that sync from a desktop upload. See [Anthropic's sync requirements](https://support.claude.com/en/articles/13837440-use-plugins-in-claude).

### Managed ChatGPT workspaces

A workspace admin can choose **Admin → Plugins → Add → Import marketplace** with source `https://github.com/IIVIIask/deeperas`, an empty **Path**, and branch `main`. New imports have daily automatic sync; **Admin → Plugins → Marketplaces → Sync now** requests an earlier update. Review the import result and installation policy. See [OpenAI's workspace sync guide](https://learn.chatgpt.com/docs/enterprise/plugin-management).

This applies to GitHub-managed workspace plugins. An existing personal plugin uploaded as an archive is a separate installation: pushing to GitHub does not update it. Its owner must update it separately, or use the GitHub marketplace installation in a supported host. Do not install both copies in the same host.

### Local checkout or copied skill

Run `git pull --ff-only` in your checkout and repeat the installation steps, or download the latest ZIP and replace the whole `deeperas` skill folder, including `references/` and `scripts/`. Start a new conversation.

If you use a local Codex plugin in the desktop app, restart the app after updating its files, then start a new conversation.

After a plugin update, check the displayed package version against the version at the top of this guide. For Codex CLI, use [the installed-version check](#check-the-installed-version). For a Cursor plugin, use [the Cursor version check](#check-the-cursor-plugin-version). For a manually copied Cursor skill, use [the copied-skill revision check](#check-the-copied-skill-revision) instead. The native sync schedules above come from the host documentation; they have not been verified in a managed team workspace for this release.

## Your first conversation

```text
Use Deeperas to help me plan a page for my plugin.
Ask me about the choices that matter before you build it.
```

You can choose an option, answer in your own words, or delegate a specific choice:

```text
Choose the visual style for me, but ask before deciding the user flow.
```

To end the questions for this request:

```text
Answer now with what you can support from the information available.
```

That does not select missing targets or authorize external actions. To stop the workflow, say “Stop using Deeperas for this task.”

## Troubleshooting

| Symptom | Check |
| --- | --- |
| The skill does not appear | Confirm the plugin is installed and enabled, or that the copied folder ends in `deeperas/SKILL.md`. Start a new conversation. |
| Cursor has no repository import option | Use the local skill method. |
| The assistant does not follow the workflow | Select the skill explicitly (`$deeperas`, `@Deeperas`, or `/deeperas`) and start a new conversation. If it still fails, open an issue with a minimal example. |
| The assistant reports a missing reference | Restore the full skill folder for its topic-specific procedures. Supported ordinary work can continue; a step stops if its necessary prerequisites or checks cannot be established. Missing applicable memory instructions keep persistence OFF. |
| Persistent memory is disabled | OFF is the default. Only when project-specific memory use is explicitly requested/authorized, verify complete applicable memory references, permitted durable project files, Node.js/Git execution, and the helper. A storage/privacy failure disables memory; ordinary conversation still works. Do not substitute account memory or shared ignores. |
| You see duplicated instructions | Keep one installation method per host. |

[Back to the README](README.md) · [Power-user guide](docs/POWER-USERS.md)
