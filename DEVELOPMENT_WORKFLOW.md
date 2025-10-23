# Feature/Bugfix Development Workflow

This document outlines the standard process for building new features or fixing bugs using a Pull Request (PR) workflow.

### Step 1: Create a New Pull Request

1.  Create your new feature or bugfix branch locally from an up-to-date `master` branch.
    - _Example:_ `git checkout -b feature/my-new-feature` or `git checkout -b fix/login-bug`

2.  Push your new branch to the remote repository.

    ```bash
    git push -u origin <your-branch-name>
    ```

3.  Go to the GitHub repository and open a new Pull Request.
    - **Base Branch:** `master`
    - **Compare Branch:** `<your-branch-name>`

4.  **Mark the PR as a Draft.**
    - This is critical. It signals to your team that the PR is a work in progress and not ready for a final review or merging.

5.  **Assign Metadata.**
    - **Reviewers:** Request reviews from your teammates or team leads.
    - **Assignees:** Assign yourself to the PR.
    - **Labels:** Add relevant labels (e.g., `feature`, `bug`, `wip`).

### Step 2: Develop and Push Commits

1.  Work on your feature or bug fix locally on your branch.

2.  Commit your changes regularly with clear, descriptive messages.

3.  Push your commits to the remote branch frequently.

    ```bash
    git push
    ```

    - This keeps your PR updated with your latest work, allows teammates to see your progress, and backs up your code.
    - Your CI (Continuous Integration) status checks will run on each push, giving you early feedback if you've broken any tests or linting rules.

### Step 3: Finalize and Merge

1.  **Mark as "Ready for Review".**
    - Once your feature is complete, all tests pass locally, and you believe it's ready for merging, remove the **Draft** status from your PR.

2.  **Check CI Status.**
    - Look at the "Checks" section of your PR.
    - Ensure that all required status checks (e.g., `Build and Test`, `Linting`) have passed and are showing a green checkmark ✅.
    - If any checks fail ❌, fix the issues and push your changes again.

3.  **Merge the PR.**
    - After all checks have passed and you have received the required approvals from your reviewers, you can merge the PR.
    - Use the **"Squash and merge"** or **"Rebase and merge"** option if your project's policy requires it.

---

### Workflow Complete

Your code is now in the `master` branch!
