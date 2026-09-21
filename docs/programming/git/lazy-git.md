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

### - Action 1: Stage a file / all files

- <kbd>Space</kbd>: (on a file name): Toggle staging/unstaging of the selected file
- <kbd>a</kbd>: Toggle between staging all files or resetting all files

### - Action 2: Commit staged changes

- <kbd>c</kbd>: Open the commit message editor to write your commit message

### - Action 3: Discard file changes

- <kbd>d</kbd>: (on a file name): Discard changes on the selected file (shows confirmation box)
- <kbd>Shift</kbd>+<kbd>D</kbd>: Open a menu with multiple discard options
  - **Nuke working tree**: Clears all changes and deletes all new files (most commonly used)

### - Action 4: View file changes

- <kbd>Enter</kbd>: (on a file name): Navigate to the split view showing file changes
  - Left side: unstaged changes
  - Right side: staged changes

### - Action 5: Stash changes

- <kbd>s</kbd>: Stash changes. Asks for confirmation and an optional name for the stash.
- <kbd>Shift</kbd>+<kbd>s</kbd>: Opens a stash options menu:
  - <kbd>S+a+Enter</kbd>: Stash all changes
  - <kbd>S+s+Enter</kbd>: Stash staged changes
  - <kbd>S+u+Enter</kbd>: Stash unstaged changes

---

## 3. Files --> Diff View Sub-Panel

When you press <kbd>Enter</kbd> on a file, you enter the diff view where you can stage individual lines or hunks.

### - Action 1: Switch between staging modes

- <kbd>Space</kbd>: (on a line/hunk): Add or remove the current line/hunk (toggles between staged/unstaged)
- <kbd>a</kbd>: Toggle between two staging modes:
  - **Hunk mode**: Stage entire hunks (like VS Code's diff viewer)
  - **Line mode**: Stage individual lines

### - Action 2: Select range of changes

- <kbd>v</kbd>: Start selecting a range of lines
- <kbd>↑</kbd> / <kbd>↓</kbd> (Arrow Keys Up/Down): Extend the selection range
- <kbd>Space</kbd>: Stage or unstage the selected range

### - Action 3: Navigate between diff panes

- <kbd>Tab</kbd>: Switch from the left pane (unstaged) to the right pane (staged)

### - Action 4: Remove changes from file

- <kbd>d</kbd> (on a line/hunk in the left pane): Delete the line/change or selected range
- <kbd>d</kbd> (on a line/hunk in the right pane): Unstage the change

---

## 4. Branches Panel

### - Action 1: Switch to branch

- <kbd>Space</kbd> (on a branch): Check out to that branch

### - Action 2: Fetch a Branch

- <kbd>f</kbd> (on a branch): Fetch the selected branch

### - Action 3: Rebase

- <kbd>rs</kbd> You want to rebase `side-branch` on top of `develop`. Check out to `side-branch` (will be marked with `*`), stand on `develop` using Up/Down arrow keys (<kbd>↑</kbd> / <kbd>↓</kbd>), and hit `rs`, for a simple rebase.

### - Action 4: Create a pull request

- <kbd>o</kbd>: Create a pull request from the currently selected branch
  - The pull request will target the default branch (e.g., `main` or `master`)
- <kbd>Shift</kbd>+<kbd>O</kbd>: Create a pull request with a target branch selection
  - Opens a searchable dropdown allowing you to choose which branch to merge into

---

## 5. Commits Panel

### - Action 1: View commit files

- <kbd>Enter</kbd> (on a commit): View the actual files that were involved in that commit. By hitting <kbd>Esc</kbd>, you can go back to the list of commits.

### - Action 2: Reset to a commit

- <kbd>g</kbd><kbd>s</kbd> (on a commit): Soft reset to that commit (keep the changes).
- <kbd>g</kbd><kbd>h</kbd> (on a commit): Hard reset to that commit (discard the changes).

### - Action 3: Amending a commit

1. Make changes to a file(s), and **stage** them.
2. Navigate to the **Commits panel**.
3. Stand on the **commit** you want to amend.
4. <kbd>Shift</kbd>+<kbd>A</kbd>+<kbd>Enter</kbd>: Request to amend, confirm and apply, the commit with your changes.

### - Action 4: Cherry pick commits on a branch

You want to cherry pick commits from branch **A** to branch **B**.

When on branch **A**:

1. Navigate to the **Commits panel**.
2. <kbd>v</kbd>: Start **range selection mode**.
3. <kbd>↑</kbd> / <kbd>↓</kbd> Using the Up/Down arrow keys, **select a range of multiple commits**.
4. <kbd>Shift</kbd>+<kbd>C</kbd>: Copy the **selected** commit hashes.
5. Navigate to the **Branches panel**.
6. Hit <kbd>Space</kbd> on the **target branch (B)** to check out to it.
7. Navigate to **Commits Panel**.
8. Hit <kbd>Shift</kbd>+<kbd>V</kbd> to paste and apply the copied commits (cherry pick).

### - Action 4: Squash a commit with the commit below it

- <kbd>s+Enter</kbd> (on a commit): Squash the commit with the commit below it. Asks for confirmation before executing.

### - Action 5: Revert a commit

- <kbd>t+Enter</kbd> (on a commit): Revert that commit. Asks for confirmation before execution.

### - Action 6: Move code between commits

To move specific changes from one commit to another:

1. Select a commit and press <kbd>Enter</kbd> on a file to view all changes made to that file.
2. Use <kbd>Space</kbd> to extract specific diffs and create a "custom patch" (visible on the right side).
3. Press <kbd>Esc</kbd> twice to return to the commits list.
4. Navigate to the target commit where you want to move the patch.
5. Press <kbd>Ctrl</kbd>+<kbd>P</kbd> to open the patch menu.
6. Select "move the patch into the selected commit".
