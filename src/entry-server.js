import { createApp } from './main'

export default context => {
  return new Promise((resolve, reject) => {
    const { vm, router } = createApp()

    router.push(context.url)

    router.onReady(() => {
      const currentRouteName = router.currentRoute.name

      if (currentRouteName === '404') {
        context.HTTPStatus = 404
      }

      resolve(vm)
    }, reject)
  })
}
