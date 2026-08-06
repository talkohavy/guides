# Vim

:::tip
💡 Pro Tip: Use `.` to repeat your last editing command.

Plus, if you were in insert mode, type something, then went to normal mode, hitting `.` would copy all that you wrote in a new line below the cursor.
:::

## 1. Vim Structure

Everything in `vim` can be considered as a combination of:

**Command + Count + Motion**

For example, `d3↓` means to delete 3 lines down from the cursor.

<br/>

## 2. Install neovim

In MacOS:

```bash
brew install neovim
```

In Linux:

```bash
sudo apt-get install neovim
```

<br/>

## 3. Create the configuration file

```bash
vi ~/.vimrc
```

It's contents should be:

```
" Show line numbers
set number

" Relative line numbers
set rnu

" Highlight search results
set hlsearch

" Convert tab into spaces
set expandtab

" Tabs are 2 spaces
set tabstop=2

" Defines the number of spaces used for auto-indenting and shift commands (>> or <<).
set shiftwidth=2

" Makes searches case-insensitive.
set ignorecase

" Switches search to case-sensitive if you type an uppercase letter.
set smartcase


" Copies indentation from the previous line on new
set autoindent

" Keeps a padding of 5 lines visible above and below the
set scrolloff=5

" --------------
" Commented out:
" --------------

" Show underline where cursor is
" set cursorline

" Wrap around text
" set wrap

" Encoding
" set encoding=utf-8

" Show status bar at the bottom
" set laststatus=2
```

<br/>

## 4. Motion

- `0`: Moves to the **beginning** of the line.
- `$`: Moves to the **beginning** of the line.
- `_`: Moves to the **beginning** of the first word in the line.
- `gg`: Jump to the **top** of the file.
- `G`: Jump to the **bottom** of the file.
- `w`: Move to the **beginning** of the next word.
- `W`: Move to the **beginning** of the next WORD.
- `e`: Move to the **end** of the current word.
- `E`: Move to the **end** of the current WORD.
- `b`: Moves back to the **beginning** of the previous word.
- `B`: Moves back to the **beginning** of the previous WORD.
- `f(` - Moves **forward** to, and on, the specified character.
- `2f(` - Moves **forward** to, and on, the 2nd appearance of the specified character.
- `t(` - Moves **forward** to, but not on, the specified character.
- `F(` - Moves **backwards** to, and on, the specified character.
- `T(` - Moves **backwards** to, but not on, the specified character.
- `;` & `,` - Repeat the actions of either `f(` or `t(`, meaning next result, or previous result.
- `{` or `}` - Moves the cursor **backward/forward** by one paragraph (mostly new lines).
- `%` - Move the cursor to the **matching braces**.
- `zz` - Scroll so the **current line** is centered on the screen.
- `H` - Move the cursor to the **top** of the visible screen (High).
- `M` - Move the cursor to the **middle** of the visible screen (Middle).

<br/>

## 5. Go into Insert / Replace Mode

- `i` - Goes to insert mode before the current position.
- `a` - Goes to insert mode after the current position.
- `I` - Go to the beginning of the line, but in insert mode.
- `A` - Go to the end of the line, but in insert mode.
- `o` - Creates a new line **below** your cursor, moves to it, and goes to insert mode.
- `O` - Creates a new line **above** your cursor, moves to it, and goes to insert mode.
- `R` - Goes to replace mode, overwriting characters as you type, until you press `Esc`.

## 6. Commands

- `d` – delete.
- `D` - Delete from cursor, including, until the end of the line.
- `dd` – Deletes (cut) the current line.
- `c` – deletes, and puts you in insert mode.
- `C` – Deletes everything to rhe right, and puts you in insert mode.
- `y` – Yank (copy).
- `Y` - same as `yy`.
- `yy` – Yank (copy) the current line.
- `p` – Paste **after** cursor.
- `P` – Paste **before** cursor.
- `x` - immediately delete from cursor **onwards** (like Del in windows).
- `X` - immediately delete from cursor **backwards** (like backspace in windows).
- `u` – Undo last change.
- `Ctrl + r` – Redo last change.
- `r` - Replaces the letter under the cursor with the next letter you type, and stays in normal mode.
- `Shift + >>` - Indent line to the right.
- `Shift + <<` - Indent line to the left.
- `J` – Join the current line with the next one.
- `ZZ` – Save and quit (same as `:wq`). Very useful.

<br/>

## 7. Deleting Combinations

### - A. Give it a name

- `d$` – Deletes from cursor all the way to the end of the line.
- `d0` – Deletes from cursor all the way to the beginning of the line.
- `dw` – Deletes 1 word forward from where your cursor is.
- `db` – Deletes 1 word backwards from where your cursor is forward.
- `d3w` – Deletes 3 word forward from where your cursor is.
- `d3→` – Deletes 3 letters to the right.
- `dG` – Deletes from the current line to the end of the file.
- `dgg` – Deletes from the current line to the beginning of the file.
- `10dd` – Deletes n lines (e.g., `10dd` deletes 10 lines from the current line downward).
- `df(` – Delete content between my cursor all the way up to, and including, the character `(`.
- `dt(` – Delete content between my cursor all the way up to, not including, the character `(`.
- `d2f(` – Delete content between my cursor all the way up to, and including, the 2nd appearance of the character `(`.

### - B. In / Around / Insert mode

In:

- `diw` - Deletes a word, even if cursor is inside the word.
- `diW` - Deletes a WORD, even if cursor is inside the WORD.
- `di{` - Deletes all the contents between the confining **curly braces**.
- `di[` - Deletes all the contents between the confining **brackets**.
- `di"` - Deletes all the contents between the confining **quotes**.

Around:

- `daw` - Deletes a word, and surrounding spaces, even if cursor is inside the word/space.
- `daW` - Deletes a WORD, even if cursor is inside the word.
- `da{` - Deletes all the contents between the confining **curly braces**.
- `da[` - Deletes all the contents between the confining **brackets**.
- `da"` - Deletes all the contents between the confining **quotes**.

Insert mode:

- `ciw` - Deletes a word, even if cursor is inside the word, and puts you in insert mode.
- `ciW` - Deletes a WORD, even if cursor is inside the WORD, and puts you in insert mode.
- `ci{` - Deletes all the contents between the confining **curly braces**, and puts you in insert mode.
- `ci[` - Deletes all the contents between the confining **brackets**, and puts you in insert mode.
- `ci"` - Deletes all the contents between the confining **quotes**, and puts you in insert mode.

<br/>

## 8. Copying Combinations

- `yy3p` - duplicate line 3 times, **below** cursor.
- `yy3P` - duplicate line 3 times, **above** cursor.
- `6yyp` - copy 6 lines **below** cursor, then paste (can move anywhere) **below** cursor.
- `6yyP` - copy 6 lines **below** cursor, then paste (can move anywhere) **above** cursor.

## 9. Visual Mode

Visual mode allows you to select text, and show you what you've selected in a visual way.  
Can you manage without ever using visual mode? Yes. Do you want to? No.  
Visual mode is great for safely performing operations, in such a way that you have assurance of what is going to happen when you execute the action.

- `v` – Start visual character selection - selects character by character
- `V` – Start visual line selection - selects entire lines
- `Ctrl + v` – Start visual block selection (column mode) - very powerful for column editing

When i visual mode, use the arrow keys to select multiple lines.

**Operations on Selected Text:**

- `d` or `x` – Delete (cut) the selected text
- `y` – Yank (copy) the selected text
- `c` – Change (delete and enter insert mode)
- `>` – Indent selected lines to the right
- `<` – Indent selected lines to the left
- `~` – Toggle case of selected characters
- `u` – Make selected text lowercase
- `U` – Make selected text uppercase

<br/>

## 10. Search and Replace

### Search

- `/word` – Search forward for "word"
- `?word` – Search backward for "word"
- `n` – Go to next match
- `N` – Go to previous match

### Find and Replace

**Manual (search + change + repeat):**

1. `/word` – Search for the word
2. `cw` – Change the word (deletes it, enters insert mode)
3. Type the replacement, then `Esc`
4. `n` – Jump to the next match
5. `.` – Repeat the last change on that match (skip unwanted ones with another `n`)

**Command (on a selection or the whole file):**

1. Select text with `v` or `V` (or skip selection to operate on the whole file)
2. Hit `:` — if you selected, Vim auto-fills `:'<,'>`
3. Type `s/word-to-find/replace-with/g` and hit Enter
   - `g` is optional: with it, every match on each line is replaced; without it, only the first match per line
   - Whole file: `:%s/word-to-find/replace-with/g`

## 11. Legend

1. word - hello-world is 2 words
2. WORD - a non-whitespace sequence of characters
3. `(` - whenever I need to use an example character, I will use `(`
