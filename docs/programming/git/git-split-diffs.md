# `git-split-diffs`

`git-split-diffs` is a very cool diff tool.

Get the the most powerful syntax highlighting git-diff in your terminal.
It is GitHub style, with split view (side by side).

```bash
npm install -g git-split-diffs

git config --global core.pager "git-split-diffs --color | less -RFX"
```

Enable scrolling in the terminal:

```bash
git config --global core.pager "git-split-diffs --color | less -+LFX"
```

Narrow terminals:

Split diffs can be hard to read on narrow terminals, so we revert to unified diffs if we cannot fit two lines of `min-line-width` on screen. This value is configurable:

```bash
git config --global split-diffs.min-line-width 40
```

This defaults to `80`, so screens below `160` characters will display unified diffs. Set it to `0` to always show split diffs.
