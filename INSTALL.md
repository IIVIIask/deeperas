# Install Deeperas

Deeperas works in a recent AI host with plugin or Agent Skills support. The current version is `0.2.48+20261014r42` (skill revision R42). The skill is one `SKILL.md` plus five files in `references/`; all six must be installed together. See [what changed](CHANGELOG.md).

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
2. Copy the whole folder `plugins/deeperas/skills/deeperas/`, including `references/`, to one of these locations:

| Scope | Destination |
| --- | --- |
| One project | `.cursor/skills/deeperas/` |
| All your projects | `~/.cursor/skills/deeperas/` |

`~` is your home directory. Create the folders if they do not exist. The copied folder must contain `SKILL.md` and all five reference files; copying only `SKILL.md` leaves the skill incomplete. Keep the [MIT license notice](plugins/deeperas/LICENSE) with your copy.

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

## Tested with

- **Codex.** Version `0.2.48+20261014r42` installed from a local checkout on October 14, 2026. All six skill files, the license notice, three PNGs, icon references, and the Website link matched the repository.
- **Cursor 3.24.12.** R33 was imported from GitHub on October 11, 2026. The blue D icon appeared in light and dark themes, and “Try in Chat” loaded the skill and returned a clarification question. The current package includes R42 instructions and later packaging changes; it has not been re-tested in Cursor.

The automated checks (`node --test tests/package.test.mjs`) verify that the host manifests match, all six skill files are present and linked, the license notice is included, and the icons are valid images.

## Updating an existing installation

GitHub is the distribution source. Updates reach installed users through their host's marketplace refresh or sync. Deeperas cannot force an update on every personal installation, and a GitHub release alone does not update copied files. Use a branch such as `main` to follow new versions; a fixed tag or commit stays pinned.

### Codex

Requires the [Codex CLI](https://learn.chatgpt.com/docs/cli). Run the commands below in your terminal.

```sh
codex plugin marketplace upgrade deeperas
codex plugin add deeperas@deeperas
```

The GitHub installation above tracks `main`; the upgrade command fetches the new package. Start a new conversation so it loads the updated instructions. If you pinned a Git ref, update the pin. See [OpenAI's marketplace guide](https://developers.openai.com/plugins/build/plugins).

#### Check the installed version

```sh
codex plugin list --json
```

In `installed`, find the entry whose `name` is `deeperas`. Its `version` is the package version reported for this CLI environment. Compare it with the version at the top of this guide.

### Cursor plugin

For a **Teams or Enterprise marketplace**, an admin imports this repository in **Dashboard → Plugins & MCPs → Team Marketplaces**, then turns on **Enable Auto Refresh** in Marketplace Settings. Track `main`. This requires the Cursor GitHub App on the repository; pushes trigger re-indexing, batched at most once every ten minutes. **Refresh** requests a manual update. See [Cursor's update guide](https://prod.cursor.com/docs/plugins#keep-plugins-up-to-date).

For a personal import, use its marketplace refresh/update control if your version provides one. If it does not, use the complete copied-skill method above and replace that folder when updating. Personal imports are not promised automatic updates; the current Cursor update flow has not been tested.

#### Check the Cursor plugin version

1. Open **Customize**, then open **Deeperas** from your installed plugins.
2. Read the plugin version in its details and compare it with the package version at the top of this guide.

This is the plugin's declared package version, not the Cursor application version or a copied skill's `Plugin R...` revision. It does not confirm that a conversation has loaded the updated instructions. The version display is documented in [Cursor's release notes](https://prod.cursor.com/docs/release-notes).

### Managed ChatGPT workspaces

A workspace admin can choose **Admin → Plugins → Add → Import marketplace** with source `https://github.com/IIVIIask/deeperas`, an empty **Path**, and branch `main`. New imports have daily automatic sync; **Admin → Plugins → Marketplaces → Sync now** requests an earlier update. Review the import result and installation policy. See [OpenAI's workspace sync guide](https://learn.chatgpt.com/docs/enterprise/plugin-management).

This applies to GitHub-managed workspace plugins. An existing personal plugin uploaded as an archive is a separate installation: pushing to GitHub does not update it. Its owner must update it separately, or use the GitHub marketplace installation in a supported host. Do not install both copies in the same host.

### Local checkout or copied skill

Run `git pull --ff-only` in your checkout and repeat the installation steps, or download the latest ZIP and replace the whole `deeperas` skill folder, including `references/`. Start a new conversation.

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
| The assistant reports a missing reference | Reinstall, or copy the complete skill folder. All five files in `references/` are required. |
| You see duplicated instructions | Keep one installation method per host. |

[Back to the README](README.md) · [Power-user guide](docs/POWER-USERS.md)
