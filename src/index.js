export function formatTime(date) {
  if (!date) return ''
  if (typeof date === 'string') {
    date = new Date(date.replace('-/g', '/'))
  } else if (typeof date === 'number') {
    date = new Date(date)
  }
  const year = date.getFullYear()
  const month = '0' + (date.getMonth() + 1)
  const day = '0' + date.getDate()
  const hour = '0' + date.getHours()
  const minute = '0' + date.getMinutes()
  // const second = '0' + date.getSeconds()
  
  return `${year}年${month.slice(-2)}月${day.slice(-2)}日 ${hour.slice(-2)}时${minute.slice(-2)}分`
}

export function formatMoney(num) {
  let [int, fraction="00"] = (num + '').split('.')
  int = int.split('')
  const len = int.length
  let ans = int.reduce((p, i, idx) => {
    if (idx && (len - idx) % 3 === 0) {
      p += ','
    }
    p += i
    return p
  }, '')
  
  ans += '.' + fraction

  return ans
}

export function camel2snake(str) {
  if (typeof str !== 'string') return str
  return str.replace(/([A-Z])/g, (_, m) => `_${m.toLowerCase()}`)
}

export function snake2camel(str) {
  if (typeof str !== 'string') return str
  return str.replace(/_([a-z])/g, (_, m) => m.toUpperCase())
}

export function downloadFile(url, name = '') {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function debounce(fn, delay) {
  let timer
  return function() {
    const arg = arguments
    if (timer) {
      clearTimeout(timer)
      timer = 0
    }
    timer = setTimeout(() => {
      fn(...arg)
      clearTimeout(timer)
      timer = 0
    }, delay);
  }
}

export function throttle(fn, delay) {
  let timer
  return function() {
    const arg = arguments
    if (timer) return
    timer = setTimeout(() => {
      fn(...arg)
      clearTimeout(timer)
      timer = 0
    }, delay);
  }
}

export function nestFindParent(el, fn) {
  if (el.tagName === 'BODY') return el
  if (fn(el)) {
    return el
  } else {
    el = el.parentNode
    return nestFindParent(el, fn)
  }
}