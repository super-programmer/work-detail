<template>
  <div :class="clicked ? 'iframe-box iframe-box--fullscreen' : 'iframe-box'" id="firame" >
    <iframe v-bind:src="src" v-if="showFlag" id="firamebox"></iframe>
  </div>
</template>
<script>
export default {
  name: 'ppt',
  props: ['path', 'fileId', 'position','pptSrc','filedata'],
  data () {
    return {
      showFlag: false,
      clicked: false,
      src: `${this.filedata.baseStatic}common/ppt/index.html?fileid=${this.path}&index=${this.position<=0 ? 0 : this.position-1}`
    }
  },
  mounted () {
    var _this = this
    this.preHeat(_this.pptSrc).then(() => {
      this.showFlag = true
    })
    window.addEventListener('message', function (e) {
      if (e.data === 'fullscreen') {
        _this.fullscreen()
      } else if (e.data === 'exitfullscreen') {
        _this.exitFullScreen()
      }else{
      }
    }, false)
  },
  methods: {
    // 全屏事件
    fullscreen: function (ev) {
      this.$data.clicked = !this.$data.clicked
    },
    // 退出全屏
    exitFullScreen: function (ev) {
      this.$data.clicked = false
    },
    // 预热ppt
    preHeat: function (src) {
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            resolve()
          }
        }
        xhr.open('GET', `https://ow.yunguxt.com/?furl=http://fs.yunguxt.com/${src}`, true)
        xhr.send()
      })
    }
  }
}
</script>

<style scoped>

</style>
