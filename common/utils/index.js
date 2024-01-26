// 把utils文件夹下的所有文件都注册到Vue里
export default {
  install(app) {
    // 挂载到全局
    console.log('utils install')
    app.config.globalProperties.$utils = {}
    // const components = import.meta.glob('./*.js', { eager: true })
    // 将js和ts加载
    const components = import.meta.globEager('./*.{js,ts}')
    // 遍历组件模块实现自动注册
    for (const [key, value] of Object.entries(components)) {
      // 拼接组件注册的 name
      const componentName = key.replace('./', '').split('/')[0]
      if (componentName !== 'index.js') {
        // 通过 defineAsyncComponent 异步导入指定路径下的组件
        if (components[key].default) {
          app.use(components[key].default)
        }
      }
    }
  }
}
