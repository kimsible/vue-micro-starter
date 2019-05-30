import Vue from 'vue'

export default context => {
  context.HTTPStatus = 404
  return new Vue({
    render (h) {
      return h('div', context.url)
    }
  })
}
