# VI

## 1. Navigation

- `0`: Move to the start of the line
- `99 + RightArrow`: Move to the end of the line
- `gg`: Jump to the top of the file
- `Shift + g`: Jump to the bottom of the file
- `w`: Move to the start of the next word
- `e`: Move to the end of the current word
- `b`: Move to the beginning of the previous word
- `fx`: Move to the next x character on the line (replace x)
- `;`: Repeat last f, t, F, or T command

---

## 2. Editing

- `dd` – Deletes (cut) the current line
- `ndd` – Deletes n lines (e.g., `10dd` deletes 10 lines from the current line downward)
- `dG` – Deletes from the current line to the end of the file
- `dgg` – Deletes from the current line to the beginning of the file
- **Visual Mode**: Press `V` to enter visual line mode, then use the arrow keys to select multiple lines, then press `d` to delete them
- `Shift + c` – Deletes everything to rhe right, and puts you in insert mode
- `u` – Undo last change
- `Ctrl + r` – Redo last change
- `Shift + j` – Join the current line with the next one
- `yy` – Yank (copy) the current line
- `p` – Paste after cursor
- `Shift + p` – Paste before cursor
- `cw` – Change word (deletes the word from where the cursor is and to the right and puts you in insert mode)

---

### 3. Visual Mode

Visual mode allows you to select text before performing operations on it. This is useful for deleting, copying, or modifying multiple lines or blocks of text.

**Entering Visual Mode:**

- `v` – Start visual selection (characterwise) - selects character by character
- `V` – Start visual line selection - selects entire lines
- `Ctrl + v` – Start visual block selection (column mode) - very powerful for column editing

**Navigation in Visual Mode:**

- Use arrow keys to extend your selection
- Use `$` to select to end of line, `0` to select to start of line
- Use `gg` or `G` to select to top/bottom of file
- Use `w`, `e`, `b` to select by words

**Operations on Selected Text:**

- `d` or `x` – Delete (cut) the selected text
- `y` – Yank (copy) the selected text
- `c` – Change (delete and enter insert mode)
- `>` – Indent selected lines to the right
- `<` – Indent selected lines to the left
- `~` – Toggle case of selected characters
- `u` – Make selected text lowercase
- `U` – Make selected text uppercase

---

### 4. Search and Replace

- `/word` – Search forward for "word"
- `?word` – Search backward for "word"
- `n` – Go to next match
- `Shift + n` – Go to previous match
- `:%s/foo/bar/g` – Replace all occurrences of "foo" with "bar" in the file

---

- 💡 Pro Tip: Use `.` to repeat your last editing command
