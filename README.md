# postcss-bud
一款 PostCSS 插件，居中视图。

## 原理和输入输出

宽：`min(calc(100vh * viewportWidth / viewportHeight), 100vw)`

高：`min(calc(100vw * viewportHeight / viewportWidth), 100vh)`

输入：

```css

.petal {
  width: 1920px;
  height: 540px;
}

.bud {
  width: 36px;
  height: 36px;
  position: fixed;
  bottom: 0;
  right: 0;
}
```

输出：

```css
:root {
  --vW: min(calc(100vh * 1920 / 1080), 100vw); /* viewport width */
  --vH: min(calc(100vw * 1080 / 1920), 100vh); /* viewport height */
  --yE: calc(50% - var(--vH) / 2); /* column edge space */
  --xE: calc(50% - var(--vW) / 2); /* row edge space */
}

.petal {
  width: calc(var(--vW) * 1920 / 1920);
  height: calc(var(--vW) * 540 / 1920);
}

.bud {
  width: calc(var(--vW) * 36 / 1920);
  height: calc(var(--vW) * 36 / 1920);
  position: fixed;
  bottom: calc(var(--yE) + calc(var(--vH) * 0 / 1080));
  right: calc(var(--xE) + calc(var(--vW) * 0 / 1920));
}
```