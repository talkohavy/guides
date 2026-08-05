# VI

**Command + Count + Motion**

## 1. Install neovim

```bash
brew install neovim
```

```bash
sudo apt-get install neovim
```

## 2. Create the configuration file

```bash
vi ~/.vimrc
```

it's contents should be:

```vi
" Show line numbers
set number

" Wrap around text
set wrap

" Encoding
" set encoding=utf-8

" Show status bar at the bottom
" set laststatus=2
```

## 1. Motion

- `0`: Moves to the start of the line
- `$`: Moves to the end of the line
- `_`: Moves to the beginning of the first word in the line
- `gg`: Jump to the top of the file
- `G`: Jump to the bottom of the file
- `w`: Move to the start of the next word
- `e`: Move to the end of the current word
- `b`: Moves back to the beginning of the previous word
- `f(` - Moves **forward** to, and on, the specified character (in this case, to `(` )
- `t(` - Moves **forward** to, but not on, the specified character (in this case, to `(` )
- `F(` - Moves **backwards** to, and on, the specified character (in this case, to `(` )
- `T(` - Moves **backwards** to, but not on, the specified character (in this case, to `(` )
- `;` & `,` - Repeat the actions of either `f(` or `t(`, meaning next result, or previous result.
- `I` - Go to the beginning of the line, but in insert mode.
- `A` - Go to the end of the line, but in insert mode.
- `o` - Creates a new line **below** your cursor, moves to it, and goes to insert mode.
- `O` - Creates a new line **above** your cursor, moves to it, and goes to insert mode.

---

## 2. Commands

- `x`: Deletes 1 letter (like Del in windows)
- `u` – Undo last change
- `p` – Paste after cursor
- `yy` – Yank (copy) the current line
- `dd` – Deletes (cut) the current line
- `Ctrl + r` – Redo last change

---

## 3. Deleting Combinations

- `d$` – Deletes from cursor all the way to the end of the line
- `d0` – Deletes from cursor all the way to the beginning of the line
- `d0` – Deletes from cursor all the way to the beginning of the line
- `dw` – Deletes 1 word forward from where your cursor is
- `db` – Deletes 1 word backwards from where your cursor is forward
- `d3w` – Deletes 3 word forward from where your cursor is
- `d3→` – Deletes 3 letters to the right
- `dG` – Deletes from the current line to the end of the file
- `dgg` – Deletes from the current line to the beginning of the file
- `10dd` – Deletes n lines (e.g., `10dd` deletes 10 lines from the current line downward)
- `df(` – Delete content between my cursor all the way up to, and including, the character `(`.
- `dt(` – Delete content between my cursor all the way up to, not including, the character `(`.
- `d2f(` – Delete content between my cursor all the way up to, and including, the 2nd appearance of the character `(`.

- `Shift + c` – Deletes everything to rhe right, and puts you in insert mode
- `Shift + j` – Join the current line with the next one
- `Shift + p` – Paste before cursor
- `cw` – Change word (deletes the word from where the cursor is and to the right and puts you in insert mode)

---

### 3. Visual Mode

Visual mode allows you to select text before performing operations on it. This is useful for deleting, copying, or modifying multiple lines or blocks of text.

**Entering Visual Mode:**

- `v` – Start visual selection (characterwise) - selects character by character
- `V` – Start visual line selection - selects entire lines
- `Ctrl + v` – Start visual block selection (column mode) - very powerful for column editing

- **Visual Mode**: Press `V` to enter visual line mode, then use the arrow keys to select multiple lines, then press `d` to delete them

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
