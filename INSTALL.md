# Install Deeperas

Use a recent AI host with plugin or Agent Skills support. The current package is `0.2.46+20261013r42`, using the **R42** skill. It includes one core `SKILL.md` and five required files in `references/`; your host provides the model and any tools. See the [changes since the previous GitHub release](CHANGELOG.md).

Choose the plugin or local skill method for a given host. Installing both can duplicate the instructions.

## Codex

### From GitHub

```sh
codex plugin marketplace add IIVIIask/deeperas
codex plugin add deeperas@deeperas
```

Start a new conversation and say “Use Deeperas to help me plan this project.”

Select the installed Deeperas plugin or skill explicitly if a plain-text request does not load it. R42 defines activation from natural-language requests, but your host controls skill discovery and loading.

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
2. Choose **+ Add → From GitHub Repository**, enter `https://github.com/IIVIIask/deeperas`, and import the marketplace.
3. Find **Deeperas** and click **Add** to install it.
4. Start a new Agent conversation. Invoke `/deeperas` or explicitly ask to use Deeperas.

Some versions show repository import under plugin settings. The repository supplies `.cursor-plugin/marketplace.json` and a per-plugin Cursor manifest. Cursor and Codex receive the same R42 skill bundle.

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

The package follows [Cursor's plugin reference](https://cursor.com/docs/reference/plugins) and [Agent Skills guide](https://cursor.com/docs/skills).

## Tested behavior and limits

On October 11, 2026, an earlier R33 package was imported and installed in Cursor 3.24.12. The blue D appeared in the plugin list and details in light and dark themes. “Try in Chat” loaded the skill and returned a clarification question. On October 12, reopening Cursor loaded GitHub package 0.2.34; its skill texts and PNG bytes matched the release. A `/deeperas` conversation attempt was blocked by Cursor's Agent usage limit and has no behavioral verdict. R42 keeps the approved image artwork but changes the core instructions; earlier behavior checks do not certify R42 in Cursor.

Distribution checks verify matching host manifests, the six skill files, MIT notice, contained icon paths, image bytes, and host-neutral version naming. The broader conversation and logo test suite remains paused.

On October 13, 2026, package `0.2.46+20261013r42` installed successfully from the local release checkout into an isolated Codex home. The installed core, five references, MIT notice, icon references, and all four PNG files matched the release.

Separate ChatGPT checks of R42 used an explicitly configured account routing instruction. They establish behavior for those tested requests on that account; that account setting is not included in this package and the results are not a universal activation guarantee. If Deeperas does not load, select the installed plugin or skill rather than assuming a name alone activates it.

The private account-plugin icon still appeared generic in actual Codex desktop and ChatGPT checks on October 12, despite correct packaged PNGs. Renaming the image did not fix that display. The rendered account-plugin logo remains unresolved; package validation alone does not prove the account UI uses the image.

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

For a Cursor repository plugin, refresh or reinstall Deeperas from the same repository through Customize. Reopening Cursor loaded the earlier 0.2.34 update; updating to R42 in the actual Cursor UI has not been tested here.

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
| The assistant does not follow the workflow | Select the installed Deeperas plugin or skill explicitly, start a new conversation, confirm the loaded version, and share a minimal example in an issue. A typed name alone does not prove the instructions loaded. |
| The assistant reports a missing reference | Copy or reinstall the complete skill folder. R42 requires all five files in `references/`. |
| You see duplicated instructions | Keep one installation method per host. |

[Back to the README](README.md) · [Power-user guide](docs/POWER-USERS.md)
