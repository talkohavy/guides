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

- `v` – Start visual selection (characterwise)
- `V` – Start visual line selection
- `Ctrl + v` – Start visual block selection (very powerful for column editing)
- `BackSpace` / `d`, `y`, `p` – After selecting text, you can delete, yank, or paste

---

### 4. Search and Replace

- `/word` – Search forward for "word"
- `?word` – Search backward for "word"
- `n` – Go to next match
- `Shift + n` – Go to previous match
- `:%s/foo/bar/g` – Replace all occurrences of "foo" with "bar" in the file

---

- 💡 Pro Tip: Use `.` to repeat your last editing command
