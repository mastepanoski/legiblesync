# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## <small>1.2.0 (2025-11-21)</small>

### Security

* **deps**: update `js-yaml` to safe version (^3.14.2) to fix prototype pollution vulnerability
* **deps**: update `glob` to safe versions (^10.5.0 and ^11.1.0) to fix command injection vulnerability via CLI
* **deps**: implement npm overrides with nested configuration for dependency version enforcement

### Bug Fixes

* **example-eda**: add missing `sku` field to `TrackProductCreation` sync rule
* **example-express**: fix Web mock to return `{ request: 'req-id' }` for proper sync pattern matching
* **example-express**: update JWT.verify mock to accept both 'valid-token' and 'generated-token'
* **tests**: all test suites now passing (5 packages, 56 tests total)

### Documentation

* **sync-docs**: create comprehensive `docs/SYNC_DOCS.md` with table of contents and package organization
* **sync-docs**: add JSON code blocks for all sync rule specifications
* **sync-docs**: include file links to source files for easy navigation
* **dsl**: enhance `docs/test.sync` with explanatory comments about DSL syntax
* **roadmap**: update `docs/ROADMAP.md` to mark completed items (DSL example, documentation generation)
* **structure**: move documentation files from root to `docs/` directory

### Chores

* **cleanup**: remove `REVIEW_SEC.md` after security fixes verification

---

## <small>1.1.2 (2025-11-21)</small>

* feat: add CI workflow for GitHub Actions ([4288652](https://github.com/mastepanoski/legiblesync/commit/4288652))
* docs: create unified ROADMAP.md consolidating planning and DSL specification ([41c3b3d](https://github.com/mastepanoski/legiblesync/commit/41c3b3d))
* docs: update changelog ([3551a3f](https://github.com/mastepanoski/legiblesync/commit/3551a3f))
* docs: update CHANGELOG.md with commit hash for ROADMAP consolidation ([cc04a41](https://github.com/mastepanoski/legiblesync/commit/cc04a41))
* fix: add publishConfig for EDA package to enable public publishing ([c8910cd](https://github.com/mastepanoski/legiblesync/commit/c8910cd))
* fix: add publishConfig for example packages to enable public publishing ([dd6666c](https://github.com/mastepanoski/legiblesync/commit/dd6666c))
* fix: resolve Next.js SSE field name translation and test isolation ([d0bc29f](https://github.com/mastepanoski/legiblesync/commit/d0bc29f))
* fix: update gitHead in example-nextjs-sse package.json ([709150b](https://github.com/mastepanoski/legiblesync/commit/709150b))
* chore: update package versions to 1.2.0 after publish ([fa8aa49](https://github.com/mastepanoski/legiblesync/commit/fa8aa49))
* chore(release): publish 1.2.2 ([dd7f2c1](https://github.com/mastepanoski/legiblesync/commit/dd7f2c1))





