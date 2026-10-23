# Practical 12: CI/CD Pipeline with GitHub Actions

**Course Objectives / Program Outcomes:** CO5 / PO3, PO5  
**Domain:** DevOps, Continuous Integration (CI), GitHub Actions, Jest, Supertest, Automated Testing

---

## 1. Objective

To automate JavaScript syntax checks and endpoint tests through a continuous integration (CI) pipeline configured via GitHub Actions.

---

## 2. CI/CD Architecture & Pipeline Flow

```text
Developer Git Push to 'main'
             â”‚
             â–¼
[GitHub Actions Trigger (on: push / pull_request)]
             â”‚
             â–¼
Job 1: JavaScript Syntax Check
  â”œâ”€â”€ Checkout code (actions/checkout@v4)
  â”œâ”€â”€ Setup Node.js 18 (actions/setup-node@v4)
  â”œâ”€â”€ npm install
  â””â”€â”€ npm run lint (Runs Node.js syntax checks; it is not a style linter)
             â”‚ (Pass)
             â–¼
Job 2: Automated Tests (needs: syntax check)
  â”œâ”€â”€ Checkout code
  â”œâ”€â”€ Setup Node.js 18
  â”œâ”€â”€ npm install
  â””â”€â”€ npm test (Jest + Supertest suite)
             â”‚
      â”Œâ”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”
      â–¼             â–¼
[Green Checkmark] [Red Cross X]
(Tests Passed)    (Tests Failed)
```

---

## 3. Project Structure

```text
practical-12/
â”œâ”€â”€ .github/
â”‚   â””â”€â”€ workflows/
â”‚       â””â”€â”€ ci.yml           # GitHub Actions workflow YAML configuration
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ tasks.test.js        # Automated test suite (6 passing endpoint tests)
â”‚   â””â”€â”€ broken.test.js       # Deliberately failing test for pipeline demonstration
â”œâ”€â”€ app.js                   # Express application routes & test exports
â”œâ”€â”€ server.js                # Port listening runner
â”œâ”€â”€ package.json             # Test scripts & Jest configuration
â””â”€â”€ README.md
```

---

## 4. Pipeline Demonstration: Failed vs. Passed Run

### A. Demonstration of a Passing Pipeline (Green Check)
Run the automated test suite locally:
```bash
npm install
npm test
```
**Output:**
```text
PASS tests/tasks.test.js
  Practical 12: Automated CI/CD Test Suite
    âœ“ GET /health returns 200 OK with healthy status
    âœ“ GET / returns 200 OK and pipeline metadata
    âœ“ GET /tasks returns status 200 and array of tasks
    âœ“ POST /tasks creates a new task and returns status 201
    âœ“ POST /tasks with missing title returns status 400 Bad Request
    âœ“ GET /tasks/nonexistent-id returns 404 Not Found

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        1.42 s
```
*Result: Exit code `0` âž” GitHub Actions displays Green Checkmark.*

---

### B. Demonstration of a Failing Pipeline (Red X)
Run the deliberately broken test:
```bash
npm run test:fail-demo
```
**Output:**
```text
FAIL tests/broken.test.js
  â— Practical 12: Deliberately Broken Test (Failure Demonstration)
    Expected: 999
    Received: 200

      8 |     // Deliberately broken assertion: Expecting HTTP 999 instead of 200
    > 9 |     expect(res.statusCode).toBe(999);
        |                            ^
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
```
*Result: Exit code `1` âž” GitHub Actions stops the pipeline and displays a Red X with error logs.*

---

## 5. Viva Questions & Key Explanations

1. **What is the difference between Continuous Integration (CI) and Continuous Deployment (CD)?**  
   - **Continuous Integration (CI):** The practice of automatically building and running automated tests whenever code changes are pushed to version control to catch bugs immediately. This practical specifically implements **CI**.  
   - **Continuous Deployment (CD):** Automatically taking code that passed the CI stage and releasing/deploying it directly to production environments without manual intervention.

2. **Why does running tests automatically on every push catch problems earlier?**  
   It provides rapid feedback while the code is fresh in the developer's mind. Without CI, bugs accumulate unnoticed and only emerge during manual pre-release testing or in production, where root-cause analysis is significantly more expensive and complex.

3. **What would happen if the test file path in the workflow YAML was incorrect?**  
   Jest would fail with `No tests found` and exit with a non-zero exit code (failure). The CI pipeline would fail during the `npm test` step, correctly preventing unverified code from being merged.

## GitHub evidence to add after publishing the repository

The local passing test run does not create a GitHub Actions run. After pushing this folder to your GitHub repository, add a repository-specific Actions status badge and capture screenshots of one successful workflow run and the deliberate failure demonstration in `docs/evidence/`.
