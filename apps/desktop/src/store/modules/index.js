/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const files = import.meta.glob('./*.js', {eager: true})
const modules = {}

// 遍历组件模块实现自动注册
for (const [key, value] of Object.entries(files)) {
  // 拼接组件注册的 name
  const componentName = key.replace('./', '').split('/')[0]
  if (componentName === 'index.js') continue
  // 通过 defineAsyncComponent 异步导入指定路径下的组件
  modules[key.replace(/(\.\/|\.js)/g, '')] = files[key].default
}

export default modules
