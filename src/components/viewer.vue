<template>
  <div :class="clicked ? 'fileBox fileBox--fullscreen' : 'fileBox'" id="fullbox" @click="exitFullScreen">
    <div class="filebox-con" :style="video ? 'overflow:hidden;' : ''" @scroll="domscroll" id="filebox-con">
      <Img v-if="img" :src="src" :filedata="filedata"></Img>
      <Doc v-if="doc" :pages="pages" :filedata="filedata"></Doc>
      <Ppt v-if="ppt" :path="path" :fileId="fileId" :position="record" :filedata="filedata" :pptSrc="pptSrc"></Ppt>
      <Video v-if="video" :filedata="filedata" @setData="closeSet"></Video>
      <div class="filebox-tips" v-if="tipsflag">
        {{tips}}
      </div>
  </div>
  <i class="file-btn-fullscreen" @click="fullscreen" v-if="doc || img"></i>
  <div class="f-scrollbox">
    <div class="f-scrollbar"></div>
  </div>
  </div>
</template>
<script>
import axios from 'axios'
import img from './img.vue'
import doc from './doc.vue'
import ppt from './ppt.vue'
import video from './video.vue'
export default {
  name: 'viewer',
  props: ['fileId', 'position'],
  data () {
    return {
      filedata: {
        type: '',
        start: this.position || 0,
        src: '',
        name: '',
        poster: '',
        baseUrl: 'https://fs.yunguxt.com/',
        baseStatic: 'https://www.yunguxt.com/'
      }, // 多媒体数据
      loadend: false, // 下载完成表示
      clicked: false, // 全屏按钮状态
      doc: false, // 文档
      pages: '', // 文档list
      video: false, // 视频
      audio: false, // 音频
      img: '', // 图片
      src: '', // 源文件src
      pptSrc: '', //pptSrc
      length: '', //文件长度
      ppt: false, // ppt
      path: '', // pptid
      tipsflag: false, // 提示语开关
      tips: '', // 提示语
      record: this.position || 0
    }
  },
  mounted: function () {
    let _this = this
    let fileId = this.fileId

    /* 绑定esc键盘事件 */
    document.onkeydown = function (ev) {
      if (ev.keyCode === 27) {
        _this.exitFullScreen()
      }
    }


    /* 渲染数据 */
    _this.getDocData(fileId)

    /*针对图片做特殊处理*/

    let timer = ''
    let number = 0
    timer = setInterval(() => {
      number++
      if((_this.length === 1) && (number === 10)){
        clearInterval(timer)
        number = 0
        this.$emit('postData')
      }
    },1000)
  },
  components: {
    Img: img,
    Doc: doc,
    Ppt: ppt,
    Video: video
  },
  methods: {
    // 拉取数据
    getDocData: function (fileid) {
      var _this = this
      // 状态，0：等待中，1：转换中，2：转换成功，3：转换失败
      axios.get(`https://api.yunguxt.com/file/files/${fileid}`).then(res => {
        if (res) {
          if (res.data.status === 2) {
            _this.$data.tipsflag = false
            _this.analyzeData(res.data)
            _this.loadend = true
          } else if (res.data.status === 1) {
            _this.$data.tipsflag = true
            _this.$data.tips = '转换中'
          } else if (res.data.status === 0) {
            _this.$data.tipsflag = true
            _this.$data.tips = '等待中'
          } else {
            _this.$data.tipsflag = true
            _this.$data.tips = '转换失败'
          }
        } else {

        }
      })
    },
    // 数据分析
    analyzeData: function (data) {
      var _this = this
      switch (data.type) {
        case 'video':
          this.$data.video = true
          this.$data.filedata.type = data.ext
          this.$data.filedata.src = data.path
          this.$data.filedata.name = data.name
          this.$data.filedata.poster = data.poster
          break
        case 'audio':
          this.$data.video = true
          this.$data.filedata.type = data.ext
          this.$data.filedata.src = data.path
          this.$data.filedata.name = data.name
          this.$data.filedata.poster = data.poster
          break
        case 'ppt':
          this.$data.ppt = true
          this.$data.path = data.path
          this.$data.pptSrc = data.src
          break
        case 'img':
          this.$data.img = true
          this.$data.src = data.src
          this.$data.length = data.length
          break
        default:
          this.$data.doc = true
          this.$data.pages = data.pages
          this.$data.length = data.length
          break
      }
      setTimeout(function () {
        document.getElementById('filebox-con').scrollTop = _this.position || 3
        console.log(document.getElementById('filebox-con').scrollTop)
      }, 100)
    },
    // 全屏事件
    fullscreen: function (ev) {
      let _this = this
      _this.$data.clicked = !_this.$data.clicked
      ev.stopPropagation()
      ev.preventDefault()
    },
    // 退出全屏
    exitFullScreen: function (ev) {
      this.$data.clicked = false
    },
    // 多页数据保存
    domscroll: function (ev) {
      let data = {
        'position': ev.target.scrollTop,
        'tail': true
      }
      this.$emit('closeSet', data)
    },
    // 音视频保存数据
    closeSet: function (data) {
      let _data = data
      this.$emit('closeSet', _data)
    },
  }
}
</script>
<style>
</style>
