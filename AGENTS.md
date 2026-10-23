# Repository writing rules

- Avoid em dashes in original prose, documentation, image alt text, and plugin metadata. Prefer a period, comma, colon, or parentheses.
- Keep an em dash only when exact quoted text or technical correctness requires that character. Explain why it is necessary.
- The package checks enforce this rule in `README.md`, `INSTALL.md`, `CHANGELOG.md`, `docs/POWER-USERS.md`, and this file. For a necessary exception, add `<!-- em-dash-required: specific reason -->` on the same line. A stylistic preference is not a necessary exception.
- Preserve terminal commands, identifiers, and exact technical syntax when editing prose.

# Release version policy

- Use one plain `MAJOR.MINOR.PATCH` version in all four plugin manifests, current guides, GitHub releases and archive filenames. Keep historical versions unchanged and omit host names from package versions and filenames.
- Keep the skill's `R` revision separate and increasing. A packaging-only release may retain the same instruction revision.
- Use patch increments for corrections and revisions. Promote a minor series only after agreed comparative criteria have been met and the improvement and regressions are documented. Package checks alone do not demonstrate better model behavior. See `docs/POWER-USERS.md#release-version-naming`.
