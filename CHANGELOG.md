# Changelog

## 0.2.48+20261014r42 — October 14, 2026

Metadata and documentation only. Skill revision R42 and the artwork from 0.2.47 are unchanged.

- **Website points to GitHub.** The OpenAI presentation now links to this repository's README, matching the existing plugin homepage.
- **Clear update paths.** The installation guide explains native automatic sync for supported workspaces/teams and explicit updates for personal or copied installations. Codex's GitHub quick start tracks `main`.
- **Accurate verification limits.** The guide distinguishes earlier Cursor checks from the current package and keeps the generic Codex/ChatGPT icon issue unresolved.

## 0.2.47+20261014r42 — October 14, 2026

Packaging and documentation only. The skill instructions (revision R42) are unchanged.

- **One icon file.** Both hosts now use `assets/icon.png`; the identical copy `deeperas-icon.png` is removed.
- **Cleaner dark logo.** The white wordmark in `logo-dark.png` is regenerated from the light logo, which removes the jagged edge around the text. The blue D is unchanged.
- **Consistent name.** The heading inside `SKILL.md` now spells “Deeperas” like everywhere else.
- **Documentation rewritten for readers.** Shorter README and installation guide; internal release notes removed.
- **First tagged release.** `v0.2.47` on GitHub. The Wiki and Projects tabs are disabled.

## 0.2.46+20261013r42 — October 13, 2026

Skill revision R42. Compared with the previous package, `0.2.34+codex.20261011r33` (revision R33):

- **Clearer activation.** The skill recognizes a selected mention, a literal `@deeperas`, natural-language requests such as “use Deeperas,” and ordinary spelling variations in English and Greek. Quoting the name, discussing it, or asking to disable it does not activate the workflow. Related follow-ups keep it active.
- **Clarification before the first answer.** When a material condition is missing, the first response is one question with explained choices, not a recommendation with a question attached.
- **Better personal recommendations.** “Best method” and “is it worth doing” requests first resolve the user's configuration, resources, and intended use. Asking for evidence or pros and cons in the same message does not skip this step. General questions stay general.
- **Remaining conditions are rechecked.** Answering one question closes only that gap. Before recommending a method or giving steps, any other unknown condition that changes suitability is clarified rather than assumed.
- **Host-neutral version numbers.** The version no longer contains a host name, and all manifests share the same version.
- **Updated documentation.** README, installation guide, and power-user guide describe the current revision.

The five topic references are unchanged from R33. Installation paths, the MIT license, the plugin identity, and the starter prompts are unchanged.

### Known limits

Earlier Cursor checks covered R33; R42 has not been re-tested in Cursor. In the ChatGPT and Codex desktop apps the plugin icon can still appear generic. Packaged images passed validation; the cause of the generic icon remains unresolved.

[README](README.md) · [Installation](INSTALL.md) · [Power-user guide](docs/POWER-USERS.md)
