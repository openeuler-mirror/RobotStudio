/**
 * 获取当前时间的格式化字符串 2021-06-01 14:22:23
 * @return {string}
 */
export const getNowDatetimeStr = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = change(d.getMonth() + 1)
  const day = change(d.getDate())
  const hour = change(d.getHours())
  const minute = change(d.getMinutes())
  const second = change(d.getSeconds())
  function change (t) {
    if (t < 10) {
      return '0' + t
    } else {
      return t
    }
  }
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}
