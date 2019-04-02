import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/'
      // name: 'app',
    }
  ]
})
router.afterEach((to, from) => {
  var _hmt = _hmt || [];
  (function () {
    document.getElementById('baiduTJ') &&
    document.getElementById('baiduTJ').remove()
    var hm = document.createElement('script')
    hm.id = 'baiduTJ'
    hm.src = 'https://hm.baidu.com/hm.js?c83b76b30e31dbdf3c5f8c3457bd7209'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(hm, s)
  })()
})
export default router
