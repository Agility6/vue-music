
/**
 * 添加样式
 * @param {*} el 添加的元素 
 * @param {*} className 添加的样式名称 
 */
export function addClass(el, className) {
  // 判断有没有className
  if(hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

/**
 * 
 * @param {*} el 检查的元素 
 * @param {*} className 检查的元素名称 
 */
export function hasClass(el, className) {
  // 正则
  let reg = new RegExp('(^|\\s)'+className+'(\\s|$)')
  // 用来查看正则表达式与指定的字符串是否匹配。返回 true 或 false。
  return reg.test(el.className)
}