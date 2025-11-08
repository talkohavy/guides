# Lazygit

A practical guide to navigating and using [lazygit](https://github.com/jesseduffield/lazygit) with keyboard shortcuts.

---

## 1. Basics

### Panel Navigation

- <kbd>←</kbd> / <kbd>→</kbd> (Left/Right Arrow Keys): Navigate between panels in this order:
  - Status panel
  - Files panel (changed, created, or deleted files)
  - Branches panel
  - Commits panel
  - Stash panel

### Pushing / Pulling

- <kbd>p</kbd>: invokes a `git pull`.
- <kbd>Shift</kbd>+<kbd>P</kbd>: invokes a `git push`
  - When git identifies a divergence, it opens a confirmation box asking whether to `push --force` or cancel the operation.

---

## 2. Files Panel

### Basic File Staging

- <kbd>Space</kbd>: Toggle staging/unstaging of the selected file
- <kbd>A</kbd>: Toggle between staging all files or resetting all files

### Committing Changes

- <kbd>C</kbd>: Open the commit message editor to write your commit message

### Discarding Changes

- <kbd>D</kbd>: Discard changes on the selected file (shows confirmation box)
- <kbd>Shift</kbd>+<kbd>D</kbd>: Open a menu with multiple discard options
  - **Nuke working tree**: Clears all changes and deletes all new files (most commonly used)

### Viewing File Changes

- <kbd>Enter</kbd>: Navigate to the split view showing file changes
  - Left side: unstaged changes
  - Right side: staged changes

---

## 3. Diff View

When you press <kbd>Enter</kbd> on a file, you enter the diff view where you can stage individual lines or hunks.

### Staging Modes

- <kbd>A</kbd>: Toggle between two staging modes:
  - **Hunk mode**: Stage entire hunks (like VS Code's diff viewer)
  - **Line mode**: Stage individual lines
- <kbd>Space</kbd>: Add or remove the current line/hunk (toggles between staged/unstaged)

### Range Selection

- <kbd>V</kbd>: Start selecting a range of lines
- <kbd>↑</kbd> / <kbd>↓</kbd> (Arrow Keys Up/Down): Extend the selection range
- <kbd>Space</kbd>: Stage or unstage the selected range

### Navigation Between Panes

- <kbd>Tab</kbd>: Switch from the left pane (unstaged) to the right pane (staged)

### Removing Changes

- <kbd>D</kbd> (left pane): Delete the line/change
- <kbd>D</kbd> (right pane): Unstage the change

---

## 4. Branches Panel

### Switching Branches

- <kbd>Space</kbd> (on a branch): Check out to that branch

### Rebasing

- <kbd>r</kbd> (on a branch): Rebase the current branch (marked with `*`) onto the selected branch
### Creating Pull Requests

- <kbd>o</kbd>: Create a pull request

---

## 5. Commits Panel

### Viewing Commit Files

- <kbd>Enter</kbd> (on a commit): View the actual files that were involved in that commit. By hitting <kbd>Esc</kbd>, you can go back to the list of commits.

### Resetting to a Commit

- <kbd>g</kbd> (on a commit): Reset to that commit. Opens a menu asking what to do with the changes between HEAD and that commit (discard them or keep them).

### Cherry Picking

1. Navigate to the **Commits panel**
2. <kbd>V</kbd>: Start range selection mode
3. <kbd>↑</kbd> / <kbd>↓</kbd> (Arrow Keys Up/Down): Extend the range to select multiple commits
4. <kbd>Shift</kbd>+<kbd>C</kbd>: Copy the selected commit hashes
5. Navigate to the **Branches panel**
6. <kbd>Space</kbd>: Check out to the target branch
7. <kbd>Shift</kbd>+<kbd>V</kbd>: Paste and apply the copied commits (cherry pick)

### Amending Commits

1. Make changes to your file(s)
2. Navigate to the **Commits panel**
3. Select the last commit (the one you want to amend)
4. <kbd>Shift</kbd>+<kbd>A</kbd>: Request to amend the commit with your changes
5. <kbd>Enter</kbd>: Confirm and apply the amendment

### Squashing Commits

- <kbd>s</kbd> (on a commit): Squash the commit with the commit below it. Asks for confirmation before executing.

---

## 6. Quick Reference Table

| Key                           | Context           | Action                               |
| ----------------------------- | ----------------- | ------------------------------------ |
| <kbd>←</kbd> <kbd>→</kbd>     | Any panel         | Navigate between panels              |
| <kbd>Space</kbd>              | Files panel       | Toggle file staging                  |
| <kbd>Space</kbd>              | Diff view         | Stage/unstage line or hunk           |
| <kbd>Space</kbd>              | Branches panel    | Check out branch                     |
| <kbd>A</kbd>                  | Files panel       | Toggle stage/unstage all files       |
| <kbd>A</kbd>                  | Diff view         | Toggle hunk/line mode                |
| <kbd>C</kbd>                  | Files panel       | Open commit message editor           |
| <kbd>D</kbd>                  | Files panel       | Discard file changes                 |
| <kbd>D</kbd>                  | Diff view (left)  | Delete line                          |
| <kbd>D</kbd>                  | Diff view (right) | Unstage change                       |
| <kbd>Shift</kbd>+<kbd>D</kbd> | Files panel       | Open discard menu                    |
| <kbd>Enter</kbd>              | Files panel       | View file diff                       |
| <kbd>Tab</kbd>                | Diff view         | Switch between unstaged/staged panes |
| <kbd>V</kbd>                  | Diff view         | Start range selection                |
| <kbd>V</kbd>                  | Commits panel     | Start commit range selection         |
| <kbd>Shift</kbd>+<kbd>C</kbd> | Commits panel     | Copy selected commits                |
| <kbd>Shift</kbd>+<kbd>V</kbd> | Commits panel     | Paste/cherry-pick commits            |
| <kbd>Shift</kbd>+<kbd>A</kbd> | Commits panel     | Amend commit                         |
