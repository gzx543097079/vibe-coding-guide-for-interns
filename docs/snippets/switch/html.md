```html
<span id="wifi-label">Wi-Fi</span>
<button class="switch" type="button" role="switch" aria-checked="true" aria-labelledby="wifi-label">
  <span class="thumb"></span>
</button>
```

```css
.switch { position: relative; width: 50px; height: 30px; border-radius: 999px; background: #c9ced6; }
.switch[aria-checked='true'] { background: #34a853; }
.thumb { position: absolute; top: 2px; left: 2px; width: 26px; height: 26px; border-radius: 50%; background: #fff; transition: transform 0.3s; }
.switch[aria-checked='true'] .thumb { transform: translateX(20px); }
```

```js
const sw = document.querySelector('.switch')
sw.addEventListener('click', () => {
  const on = sw.getAttribute('aria-checked') === 'true'
  sw.setAttribute('aria-checked', String(!on))
})
```
