# INT216D Static Frontend

This project is implemented as plain HTML, CSS, and JavaScript with no Vite build step.

## Stack

- HTML: `index.html`
- CSS: `styles.css`
- JavaScript: `script.js`
- Animation/runtime libs: GSAP + Three.js (loaded from CDN ES modules)

## Run Locally

Use any static server from the project folder.

```bash
python3 -m http.server 3000
```

Then open `http://localhost:3000`.

## Backend Integration Hooks

The frontend emits custom events for UI actions:

- `login`
- `book-wash`
- `book-mobile`
- `book-bay`
- `join-club`

Listen from your integration script:

```js
window.INT216D.onAction(({ action, payload }) => {
  // Connect action to your backend endpoints
})
```

You can also emit manually:

```js
window.INT216D.emitAction("book-mobile", { source: "external" })
```
