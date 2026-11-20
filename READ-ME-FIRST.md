# 💌 Twenty-Three Letters — your step-by-step guide

You don't need to know how to code. You will only ever touch **three things**:

| What | Where | What it controls |
|---|---|---|
| ✉️ **The 23 letters** | `content/letters.js` | Every title and every word of every letter |
| ✎ **Greeting & details** | `content/settings.js` | Birthday greeting, intro sentence, name, sign-off, etc. |
| 🖼️ **The photograph** | `images/birthday-person.jpg` | The big portrait on the opening screen |

### ✅ Files you edit
- `content/letters.js`
- `content/settings.js`
- the photo in the `images` folder

### 🚫 Files you should never touch
- `index.html`
- everything inside the `do-not-touch` folder (`style.css`, `app.js`, `fonts.css`, `fonts/`)

> Tip: before you start, make a copy of the whole folder as a backup.
> Use a plain text editor: **VS Code** (free, recommended), Notepad (Windows) or TextEdit in plain-text mode (Mac). **Don't use Word.**

---

## 1. Replace the photograph

1. Choose a good photo. A **portrait (tall) photo** with the face in the upper half looks best. Around 1200 × 1600 pixels is plenty; try to keep the file under 1 MB so it loads fast on phones.
2. Rename it exactly **`birthday-person.jpg`** (all lowercase, with a hyphen).
3. Drop it into the `images` folder and **replace** the old file.
4. Refresh the website. Done!

**Is your photo a PNG, or has a different name?** Open `content/settings.js` and change this one line to match your file name:
`photo: "images/birthday-person.jpg",`

**Is the face cut off?** In `settings.js`, change `photoFocus`. The second number moves the crop up/down: `"50% 15%"` shows more of the top, `"50% 60%"` more of the bottom.

---

## 2. Write the 23 letters

1. Open `content/letters.js`.
2. You will see 23 blocks, each with a banner like `LETTER 01`. Each looks like this:

```js
  {
    title: "Title for Letter 01",
    text: `This is the placeholder text for Letter 01.

Delete these words and write your own...`,
  },
```

3. Replace the words inside the **"quote marks"** with your title.
4. Replace the words between the two **backticks** ( \` ) with your letter. The backtick is the slanted quote key, usually under **Esc** (on many keyboards it's next to the left Shift key or the number 1). It is not an apostrophe.
5. **Press Enter twice** (leave an empty line) to start a new paragraph. Press Enter once for a simple line break.
6. Save, refresh the page, and open the envelope to see how it looks.

**Safety rules (so nothing breaks):**
- Keep the quote marks around titles, and the backticks around texts.
- Keep the commas at the end of each line, and the `{ }` around each letter.
- Don't type a backtick inside your letter text.
- Apostrophes ( ' ) and "quotes" inside your letters are fine.
- Letters can be as long as you like; the page scrolls. Other languages work too, including Arabic (it switches to right-to-left automatically).

If you ever see a message saying *"Oops: a little typo"*, a quote, backtick, comma or bracket was deleted by accident. Undo your last change and it will come back.

---

## 3. Change the birthday greeting and other words

Open `content/settings.js`. Every line has a comment above it explaining what it does. The main ones:

- `greeting` — the big script words ("Happy 23rd Birthday")
- `name` — the name under the greeting (also written on every envelope as "For …")
- `intro` — the short romantic sentence
- `eyebrow` — the small line above the greeting
- `age` — the number on the wax seal beside the photo
- `signoff` and `signature` — the closing words and your name at the end of every letter
- `footerMessage` and `allOpenedMessage` — the words at the very bottom of the page

Only change what's between the "quote marks".

---

## 4. Preview it on your computer

**Easiest way:** double-click **`index.html`**. It opens in your browser. Edit a file, save, refresh.

**Better way (shows exactly what visitors will see):** with VS Code, install the free **Live Server** extension, right-click `index.html` → *Open with Live Server*.

**To preview on your phone:** the simplest way is to publish it (next section) and open the link on your phone.

---

## 5. Publish it online and share the link

### Option A: Netlify Drop (easiest, ~2 minutes, no account needed to try)
1. Go to **https://app.netlify.com/drop**
2. **Drag the whole project folder** (the folder that contains `index.html`) onto the page.
3. Netlify gives you a link like `https://random-name.netlify.app`. Send it!
4. Create a free account to keep the site permanently. In *Site settings → Change site name* you can pick a nicer address, e.g. `letters-for-anna.netlify.app`.

To update later: edit your files, then drag the folder onto *Deploys* again.

### Option B: GitHub Pages (free)
1. Create a free account at **https://github.com**.
2. Click **New repository**, name it (e.g. `letters`), and choose **Public** (required for free Pages).
3. Click **uploading an existing file**, drag **all the files and folders** in, and click **Commit changes**.
4. Go to **Settings → Pages**, under *Branch* choose `main` and `/ (root)`, and click **Save**.
5. After a minute your link appears: `https://YOUR-USERNAME.github.io/letters/`

### 🔒 About privacy
- The page asks search engines not to list it, but **anyone with the link can open it**. Send the link only to the birthday person.
- Choose a **not-guessable** site name.
- Don't put anything you'd be uncomfortable with others seeing if the link were ever shared.
- If you want a password, Netlify offers password protection on paid plans.

### Before you send the link, check:
- [ ] The photo is replaced
- [ ] All 23 letters have your words (no "placeholder" text left)
- [ ] `signature` in `settings.js` has your real name
- [ ] You opened it on a phone and tried at least a few letters

---

## Quick fixes

| Problem | Fix |
|---|---|
| Page shows "Oops: a little typo" | A quote mark, backtick, comma or bracket was deleted in `letters.js` or `settings.js`. Undo and save. |
| I changed something and nothing happens | Save the file, then refresh (on a phone: close the tab and reopen). |
| Photo still shows the placeholder | The file must be named exactly `birthday-person.jpg` and sit inside `images`. |
| After publishing, my edits don't appear | Upload again, then refresh (try a private tab). |

Happy birthday to them. 🤍
