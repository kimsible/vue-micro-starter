import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

export function createApp () {
  const router = createRouter()

  const vm = new Vue({
    router,
    render: h => h(App)
  })

  return { vm, router }
}
