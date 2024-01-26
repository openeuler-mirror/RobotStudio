// blockly仓库地址
// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#4zzitj
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
