# Dream Automation Project

Browser tests for the Dream application, written in TypeScript with Playwright Test.

## Requirements

- Windows, macOS, or Linux
- Node.js LTS (npm is included with Node.js)
- Access to the Dream test environment and an authorized test account

Visual Studio Code is optional. The tests use the configured Chrome project and run headed by default.

## Setup

1. Install Node.js LTS from [nodejs.org](https://nodejs.org/), then open a terminal in the project folder.
2. Install project dependencies:

   ```sh
   npm install
   ```

3. Install Playwright's Chromium browser:

   ```sh
   npx playwright install chromium
   ```

   In PowerShell, if script execution blocks `npx`, use the Windows command shim:

   ```powershell
   npx.cmd playwright install chromium
   ```

4. Configure an authorized test account in the test that you want to run. Login details are currently declared in the individual test files under `tests/`; do not commit real passwords or share them.

## Project structure

```text
.
├── .github/                 GitHub-related project configuration
├── .vscode/                 VS Code workspace configuration
├── tests/
│   ├── helpers/             Shared login and assertion helpers
│   ├── createNewOpportunity.spec.ts
│   ├── login.spec.ts
│   └── reports.spec.ts
├── package.json             npm scripts and development dependencies
├── package-lock.json        Locked dependency versions
├── playwright.config.ts     Test discovery, browser, and reporter settings
├── tsconfig.json            TypeScript compiler settings
└── README.md                Project setup and usage
```

Tests belong under `tests/` and use the `.spec.ts` suffix. The shared login helper is in `tests/helpers/login.ts`. The current browser target and test behavior are configured in `playwright.config.ts`.

## Run tests with GitHub Actions

The Playwright workflow runs when code is pushed to `main` and can also be started manually from the Actions tab. Add these repository Actions secrets before running it:

- `COMPANY_KEY`
- `TEST_USERNAME`
- `TEST_PASSWORD`

The workflow installs Chromium, runs `npm test` in headless mode, and uploads the HTML report and test results as an artifact.

## Run tests

Run all tests:

```sh
npm test
```

Run one test file:

```sh
npm test -- tests/reports.spec.ts
```

Useful alternatives:

```sh
npm run test:headed     # Run with a visible browser
npm run test:ui         # Open Playwright's interactive test UI
npm run typecheck       # Check TypeScript without running tests
```

In PowerShell, use `npm.cmd` instead of `npm` if script execution is blocked (for example, `npm.cmd test`). From Command Prompt, the regular `npm` and `npx` commands work.

## View test reports

The test run creates an HTML report. After running tests, open it with:

```sh
npm run report
```

Playwright opens the report in your browser. Failure screenshots and other run artifacts are saved under `test-results/`.
