import { throttle, } from "../utils/common"

/**
 * 获取距离元素顶部最近的子元素
 */
export default {
  install(Vue) {
    Vue.directive('current-top', {
      inserted: function (el, binding) {
        // arg 顶部偏移量，即距离顶部多少距离时判断触顶
        const { value, arg = 0, } = binding
        const {
          handler, // 回调函数
          selector, // 子元素css选择器
        } = value

        const listener = throttle( e => {
          let min = Infinity, current = null, distance, top = el.getBoundingClientRect().top
          
          const children = el.querySelectorAll(selector)
          children.forEach(i => {
            distance = Math.abs(i.getBoundingClientRect().top - top - arg)
            if (distance < min) {
              min = distance
              current = i
            }
          })
          handler(current, min)
        }, 20)
        el.addEventListener('scroll', listener)
        el.unbindEventListener = () => {
          el.removeEventListener('scroll', listener)
        }
      },
      unbind: function (el) {
        el.unbindEventListener()
      }
    })
  }
}