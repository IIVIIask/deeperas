# Install Deeperas

Use a recent AI host with plugin or Agent Skills support. The current release is **R33**, version `0.2.31+codex.20261011r33`. It includes one core `SKILL.md` and five required files in `references/`; your host provides the model and any tools.

Choose the plugin or local skill method for a given host. Installing both can duplicate the instructions.

## Codex

### From GitHub

```sh
codex plugin marketplace add IIVIIask/deeperas
codex plugin add deeperas@deeperas
```

Start a new conversation and say “Use Deeperas to help me plan this project.”

The R33 package has been checked in an isolated Codex home. Its installed core and all five references match the release source, and the package retains the MIT notice.

### From a local checkout

```sh
git clone https://github.com/IIVIIask/deeperas.git
cd deeperas
codex plugin marketplace add .
codex plugin add deeperas@deeperas
```

The repository marketplace lives at `.agents/plugins/marketplace.json`. You can also open the checkout as a trusted project and follow the host's plugin installation prompts.

See [OpenAI's plugin packaging guide](https://developers.openai.com/plugins/build/plugins) for marketplace behavior and host-specific installation details.

## Cursor

### As a plugin

1. Open **Customize** in a current Cursor version.
2. Choose **From GitHub Repository** and enter `https://github.com/IIVIIask/deeperas`.
3. Install **Deeperas**.
4. Start a new Agent conversation. Invoke `/deeperas` or explicitly ask to use Deeperas.

Some versions show repository import under plugin settings. The repository supplies `.cursor-plugin/marketplace.json` and a per-plugin Cursor manifest. Cursor and Codex receive the same R33 skill bundle.

### As a local skill

1. [Download this repository as a ZIP](https://github.com/IIVIIask/deeperas/archive/refs/heads/main.zip) and extract it.
2. Find `plugins/deeperas/skills/deeperas/`.
3. Copy that whole `deeperas` folder, including `references/`, into one of the locations below.

| Scope | The resulting file |
| --- | --- |
| This project | `.cursor/skills/deeperas/SKILL.md` |
| Your local user | `~/.cursor/skills/deeperas/SKILL.md` |

`~` means your home directory. Create the destination folders if they do not exist. Keep the package's [MIT license notice](plugins/deeperas/LICENSE) with your copy.

The installed skill folder must contain `SKILL.md` and all five reference files. Copying only the core leaves the skill incomplete.

Start an Agent conversation and type `/deeperas` to invoke the skill.

The package follows [Cursor's plugin reference](https://cursor.com/docs/reference/plugins) and [Agent Skills guide](https://cursor.com/docs/skills). **An actual Cursor installation and conversation test is still pending.**

## Updating an existing installation

### Codex repository plugin

Refresh the marketplace, then install the current package:

```sh
codex plugin marketplace upgrade deeperas
codex plugin add deeperas@deeperas
```

Start a new conversation so it loads the updated instructions. The [official OpenAI packaging guide](https://developers.openai.com/plugins/build/plugins) documents marketplace refresh. If you pinned a Git ref, update that pin to the release you intend to use.

### Local checkout or copied skill

For a cloned repository, run `git pull --ff-only` in your checkout, then repeat the installation steps for your host. For a copied Cursor skill, download the latest repository ZIP and replace the whole `deeperas` skill folder, including `references/`, in the same location. Keep one installation method per host and start a new conversation.

For a Cursor repository plugin, refresh or reinstall Deeperas from the same repository through Customize. The in-app update flow has not been tested here.

## Your first conversation

```text
Use Deeperas to help me plan a page for my plugin.
Ask me about the choices that matter before you build it.
```

You can choose an option, answer in your own words, or delegate a specific choice. For example:

```text
Choose the visual style for me, but ask before deciding the user flow.
```

To end questions for this request, say:

```text
Answer now with what you can support from the information available.
```

That does not select missing targets or authorize external actions. To stop using the workflow, say “Stop using Deeperas for this task.”

## Troubleshooting

| Symptom | Check |
| --- | --- |
| The skill does not appear | Confirm the plugin is installed/enabled, or that the local skill ends at `deeperas/SKILL.md`. Start a new conversation. |
| Cursor has no repository import option | Use the local skill method and check your version's official documentation. |
| The assistant does not follow the workflow | Invoke it explicitly, confirm the loaded version, and share a minimal example in an issue. |
| The assistant reports a missing reference | Copy or reinstall the complete skill folder. R33 requires all five files in `references/`. |
| You see duplicated instructions | Keep one installation method per host. |

[Back to the README](README.md) · [Power-user guide](docs/POWER-USERS.md)
