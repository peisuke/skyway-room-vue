import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Peer from 'skyway-js'

Vue.config.productionTip = false

Vue.mixin({
  data: function() {
    return {
      peer: new Peer({key: process.env.VUE_APP_KEY, debug: 3})
    }
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
