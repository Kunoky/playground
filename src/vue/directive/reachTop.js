import { throttle, nestFindParent } from "src/index"

/**
 * 元素滚动到容器顶部时触发回调
 */
export default {
  install(Vue) {
    Vue.directive('reach-top', {
      inserted: function (el, binding) {
        // arg 顶部偏移量，即距离顶部多少距离时判断触顶
        const { value, arg = 0, } = binding
        let cb, container
        if (typeof value === 'function') {
          cb = value
        } else if (typeof value === 'object') {
          const {
            handler, // 回调函数
            containerSelector, // 滚动容器的css选择器，默认查找最近的滚动容器
          } = value
          cb = handler
          if (containerSelector) {
            container = document.querySelector(containerSelector)
          }
        } else {
          throw new TypeError('v-reach-top need a function or a object but get a ' + typeof value)
        }
        if (!container) {
          container = nestFindParent(el, el => {
            return el.scrollHeight > el.clientHeight
          })
        }
        let preDistance = 0
        const listener = throttle( e => {
          const distance = el.getBoundingClientRect().top - container.getBoundingClientRect().top - arg
          if (distance === 0 || (distance ^ preDistance) < 0) {
            cb(distance)
          }
          preDistance = distance
        }, 20)
        container.addEventListener('scroll', listener)
        el.unbindEventListener = () => {
          container.removeEventListener('scroll', listener)
        }
      },
      unbind: function (el) {
        el.unbindEventListener()
      }
    })
  }
}