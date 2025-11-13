# Lazygit

## 1. Basics

### Panel Navigation

- <kbd>←</kbd> / <kbd>→</kbd> (Left/Right Arrow Keys): Navigate between panels in this order:
  - Status panel
  - Files panel (changed, created, or deleted files)
  - Branches panel
  - Commits panel
  - Stash panel

- <kbd>Tab</kbd> / <kbd>Shift</kbd><kbd>+</kbd><kbd>Tab</kbd>: Same as above arrows

### Pushing / Pulling

- <kbd>p</kbd>: invokes a `git pull`.
- <kbd>Shift</kbd>+<kbd>P</kbd>: invokes a `git push`
  - When git identifies a divergence, it opens a confirmation box asking whether to `push --force` or cancel the operation.

### Command Prompt

- <kbd>:</kbd>: Opens a command prompt that allows for quickly executing shell commands without having to quit lazygit or switch to a different terminal

### Help Menu

- <kbd>?</kbd>: Opens a menu with all available keybindings and actions. The menu is context-specific, and changes based on the current active panel.

---

## 2. Files Panel

### Basic File Staging

- <kbd>Space</kbd>: Toggle staging/unstaging of the selected file
- <kbd>a</kbd>: Toggle between staging all files or resetting all files

### Committing Changes

- <kbd>c</kbd>: Open the commit message editor to write your commit message

### Discarding Changes

- <kbd>d</kbd>: Discard changes on the selected file (shows confirmation box)
- <kbd>Shift</kbd>+<kbd>D</kbd>: Open a menu with multiple discard options
  - **Nuke working tree**: Clears all changes and deletes all new files (most commonly used)

### Viewing File Changes

- <kbd>Enter</kbd>: Navigate to the split view showing file changes
  - Left side: unstaged changes
  - Right side: staged changes

### Stashing Changes

- <kbd>s</kbd>: Stash changes. Asks for confirmation and an optional name for the stash.
- <kbd>Shift</kbd>+<kbd>S</kbd>: Opens a stash options menu where you can choose to stash only staged changes.

---

## 3. Files --> Diff View Sub-Panel

When you press <kbd>Enter</kbd> on a file, you enter the diff view where you can stage individual lines or hunks.

### Staging Modes

- <kbd>a</kbd>: Toggle between two staging modes:
  - **Hunk mode**: Stage entire hunks (like VS Code's diff viewer)
  - **Line mode**: Stage individual lines
- <kbd>Space</kbd>: Add or remove the current line/hunk (toggles between staged/unstaged)

### Range Selection

- <kbd>v</kbd>: Start selecting a range of lines
- <kbd>↑</kbd> / <kbd>↓</kbd> (Arrow Keys Up/Down): Extend the selection range
- <kbd>Space</kbd>: Stage or unstage the selected range

### Navigation Between Panes

- <kbd>Tab</kbd>: Switch from the left pane (unstaged) to the right pane (staged)

### Removing Changes

- <kbd>d</kbd> (left pane): Delete the line/change
- <kbd>d</kbd> (right pane): Unstage the change

---

## 4. Branches Panel

### Switching Branches

- <kbd>Space</kbd> (on a branch): Check out to that branch

### Fetching a Branch

- <kbd>f</kbd> (on a branch): Fetch the selected branch

### Rebasing

- <kbd>r</kbd> (on a branch): Rebase the current branch (marked with `*`) onto the selected branch

### Creating Pull Requests

- <kbd>o</kbd>: Create a pull request from the currently selected branch
  - The pull request will target the default branch (e.g., `main` or `master`)
- <kbd>Shift</kbd>+<kbd>O</kbd>: Create a pull request with a target branch selection
  - Opens a searchable dropdown allowing you to choose which branch to merge into

---

## 5. Commits Panel

### Viewing Commit Files

- <kbd>Enter</kbd> (on a commit): View the actual files that were involved in that commit. By hitting <kbd>Esc</kbd>, you can go back to the list of commits.

### Resetting to a Commit

- <kbd>g</kbd> (on a commit): Reset to that commit. Opens a menu asking what to do with the changes between HEAD and that commit (discard them or keep them).

### Cherry Picking

1. Navigate to the **Commits panel**
2. <kbd>v</kbd>: Start range selection mode
3. <kbd>↑</kbd> / <kbd>↓</kbd> (Arrow Keys Up/Down): Extend the range to select multiple commits
4. <kbd>Shift</kbd>+<kbd>C</kbd>: Copy the selected commit hashes
5. Navigate to the **Branches panel**
6. <kbd>Space</kbd>: Check out to the target branch
7. Move to **Commits Panel**
8. Hit <kbd>Shift</kbd>+<kbd>V</kbd> to paste and apply the copied commits (cherry pick)

### Amending Commits

1. Make changes to your file(s)
2. Navigate to the **Commits panel**
3. Select the last commit (the one you want to amend)
4. <kbd>Shift</kbd>+<kbd>A</kbd>: Request to amend the commit with your changes
5. <kbd>Enter</kbd>: Confirm and apply the amendment

### Squashing Commits

- <kbd>s</kbd> (on a commit): Squash the commit with the commit below it. Asks for confirmation before executing.

### Reverting Commits

- <kbd>t</kbd> (on a commit): Revert that commit. Asks for confirmation before execution.

### Moving Code Between Commits

To move specific changes from one commit to another:

1. Select a commit and press <kbd>Enter</kbd> on a file to view all changes made to that file
2. Use <kbd>Space</kbd> to extract specific diffs and create a "custom patch" (visible on the right side)
3. Press <kbd>Esc</kbd> twice to return to the commits list
4. Navigate to the target commit where you want to move the patch
5. Press <kbd>Ctrl</kbd>+<kbd>P</kbd> to open the patch menu
6. Select "move the patch into the selected commit"

---

## 6. Quick Reference Table

| Key                           | Context           | Action                               |
| ----------------------------- | ----------------- | ------------------------------------ |
| <kbd>←</kbd> <kbd>→</kbd>     | Any panel         | Navigate between panels              |
| <kbd>Space</kbd>              | Files panel       | Toggle file staging                  |
| <kbd>Space</kbd>              | Diff view         | Stage/unstage line or hunk           |
| <kbd>Space</kbd>              | Branches panel    | Check out branch                     |
| <kbd>a</kbd>                  | Files panel       | Toggle stage/unstage all files       |
| <kbd>a</kbd>                  | Diff view         | Toggle hunk/line mode                |
| <kbd>c</kbd>                  | Files panel       | Open commit message editor           |
| <kbd>d</kbd>                  | Files panel       | Discard file changes                 |
| <kbd>d</kbd>                  | Diff view (left)  | Delete line                          |
| <kbd>d</kbd>                  | Diff view (right) | Unstage change                       |
| <kbd>Shift</kbd>+<kbd>D</kbd> | Files panel       | Open discard menu                    |
| <kbd>Enter</kbd>              | Files panel       | View file diff                       |
| <kbd>Tab</kbd>                | Diff view         | Switch between unstaged/staged panes |
| <kbd>v</kbd>                  | Diff view         | Start range selection                |
| <kbd>v</kbd>                  | Commits panel     | Start commit range selection         |
| <kbd>Shift</kbd>+<kbd>C</kbd> | Commits panel     | Copy selected commits                |
| <kbd>Shift</kbd>+<kbd>V</kbd> | Commits panel     | Paste/cherry-pick commits            |
| <kbd>Shift</kbd>+<kbd>A</kbd> | Commits panel     | Amend commit                         |
