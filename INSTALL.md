# Install Deeperas

Deeperas works in a recent AI host with plugin or Agent Skills support. The current version is `0.2.46+20261013r42` (skill revision R42). The skill is one `SKILL.md` plus five files in `references/`; all six must be installed together. See [what changed](CHANGELOG.md).

Use one method per host. Installing the plugin and a copied skill side by side duplicates the instructions.

## Codex

### From GitHub

```sh
codex plugin marketplace add IIVIIask/deeperas
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

## Tested with

- **Codex.** Version `0.2.46+20261013r42` installed from a local checkout on October 13, 2026. All six skill files, the license notice, and the icons matched the repository.
- **Cursor 3.24.12.** The previous revision (R33) was imported from GitHub on October 11, 2026. The blue D icon appeared in light and dark themes, and “Try in Chat” loaded the skill and returned a clarification question. The current revision changes the instructions only, not the packaging, and has not been re-tested in Cursor.

The automated checks (`node --test tests/package.test.mjs`) verify that the host manifests match, all six skill files are present and linked, the license notice is included, and the icons are valid images.

## Updating an existing installation

### Codex

```sh
codex plugin marketplace upgrade deeperas
codex plugin add deeperas@deeperas
```

Start a new conversation so it loads the updated instructions. If you pinned a Git ref, update the pin.

### Cursor plugin

Import the repository again from **Customize**, or remove Deeperas and add it again, then start a new conversation. This update path has not been tested.

### Local checkout or copied skill

Run `git pull --ff-only` in your checkout and repeat the installation steps, or download the latest ZIP and replace the whole `deeperas` skill folder, including `references/`. Start a new conversation.

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
