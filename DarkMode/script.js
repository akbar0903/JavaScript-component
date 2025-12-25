'use strict'

const toggleThemeBtn = document.getElementById('toggle-dark-mode')
const htmlElement = document.documentElement

const sunIconSVG = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="theme-icon"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>`

const moonIconSVG = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="theme-icon"
        >
          <path
            d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
          />
        </svg>`

// 获取初始主题状态
const getInitialIsDark = function () {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') return true
  if (savedTheme === 'light') return false
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

// 切换主题
const setTheme = function (isDark) {
  if (isDark) {
    toggleThemeBtn.innerHTML = sunIconSVG
    htmlElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  } else {
    toggleThemeBtn.innerHTML = moonIconSVG
    htmlElement.removeAttribute('data-theme')
    localStorage.setItem('theme', 'light')
  }
}

// 只要DOM加载完毕，就初始化主题
document.addEventListener('DOMContentLoaded', function () {
  const isDark = getInitialIsDark()
  if (isDark) {
    toggleThemeBtn.innerHTML = sunIconSVG
    htmlElement.setAttribute('data-theme', 'dark')
  } else {
    toggleThemeBtn.innerHTML = moonIconSVG
    htmlElement.removeAttribute('data-theme')
  }
})

// 监听按钮点击事件，切换主题
toggleThemeBtn.addEventListener('click', function (event) {
  const isDarkBefore = htmlElement.getAttribute('data-theme') === 'dark'

  // 如果用户的浏览器的不支持Transition API，并且开启了防晕动模式，则直接切换主题
  const isAppearanceTransition =
    document.startViewTransition &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isAppearanceTransition) {
    setTheme(!isDarkBefore)
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  const transition = document.startViewTransition(function () {
    // 在回调中同步切换主题，让浏览器捕获 old/new 快照
    setTheme(!isDarkBefore)
  })

  transition.ready.then(function () {
    // 这里读取的是“切换后的新主题状态”，用于决定动画方向与伪元素
    const isDarkAfter = htmlElement.getAttribute('data-theme') === 'dark'
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]

    htmlElement.animate(
      {
        // 切到深色：让 old(light) 缩小露出 new(dark)
        // 切到浅色：让 new(light) 放大盖住 old(dark)
        clipPath: isDarkAfter ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-out',
        fill: 'forwards',
        pseudoElement: isDarkAfter
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
})
