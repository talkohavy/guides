# Vim

:::tip
💡 Pro Tip: Use `.` to repeat your last editing command
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

" Keeps a padding of 5 lines visible above and below the
set scrolloff=5

" Copies indentation from the previous line on new
set autoindent

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

- `0`: Moves to the start of the line.
- `$`: Moves to the end of the line.
- `_`: Moves to the beginning of the first word in the line.
- `gg`: Jump to the top of the file.
- `G`: Jump to the bottom of the file.
- `w`: Move to the start of the next word.
- `W`: Move to the start of the next WORD.
- `e`: Move to the end of the current word.
- `E`: Move to the end of the current WORD.
- `b`: Moves back to the beginning of the previous word.
- `B`: Moves back to the beginning of the previous word.
- `f(` - Moves **forward** to, and on, the specified character.
- `2f(` - Moves **forward** to, and on, the 2nd appearance of the specified character.
- `t(` - Moves **forward** to, but not on, the specified character.
- `F(` - Moves **backwards** to, and on, the specified character.
- `T(` - Moves **backwards** to, but not on, the specified character.
- `;` & `,` - Repeat the actions of either `f(` or `t(`, meaning next result, or previous result.
- `{` - Moves the cursor **backward** by one paragraph (mostly new lines).
- `}` - Moves the cursor **forward** by one paragraph.

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
- `y` – Yank (copy).
- `p` – Paste **after** cursor.
- `x` - Deletes 1 letter (like Del in windows).
- `D` - Delete from cursor, including, until the end of the line.
- `Y` - same as `yy`.
- `P` – Paste **before** cursor.
- `X` - Deletes 1 letter (like backspace in windows).
- `r` - Replaces the letter under the cursor with the next letter you type, and stays in normal mode.
- `u` – Undo last change.
- `yy` – Yank (copy) the current line.
- `dd` – Deletes (cut) the current line.
- `Ctrl + r` – Redo last change.
- `Shift + >>` - Indent line to the right.
- `Shift + <<` - Indent line to the left.

<br/>

## 7. Deleting Combinations

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
- `di{` - Deletes all the contents between the confining curly braces.
- `di[` - Deletes all the contents between the confining brackets.

- `Shift + c` – Deletes everything to rhe right, and puts you in insert mode.
- `Shift + j` – Join the current line with the next one.
- `Shift + p` – Paste before cursor.
- `cw` – Change word (deletes the word from where the cursor is and to the right and puts you in insert mode).

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

- `/word` – Search forward for "word"
- `?word` – Search backward for "word"
- `n` – Go to next match
- `Shift + n` – Go to previous match
- `:%s/foo/bar/g` – Replace all occurrences of "foo" with "bar" in the file

## 11. Legend

1. word - hello-world is 2 words
2. WORD - a non-whitespace sequence of characters
3. `(` - whenever I need to use an example character, I will use `(`
