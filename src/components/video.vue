<template>
  <div class="video" style="width:100%;height:100%;"></div>
</template>
<script>
export default {
  name: 'media',
  props: ['filedata'],
  data () {
    return {
      src: `${this.filedata.baseUrl}${this.filedata.src}`,
      type: `${this.filedata.type}`,
      name: `${this.filedata.name}`,
      poster: `${this.filedata.baseUrl}${this.filedata.poster}`,
      timer: ''
    }
  },
  mounted () {
    this.initPlayer()
  },
  methods: {
    initPlayer () {
      window.timeUpdateHandler = ''
      window.playHandler = ''
      window.pauseHandler = ''
      window.loadedmetadata = ''
      window.timer = ''
      let playertime = ''
      let _this = this
      let oHead = document.getElementsByTagName('HEAD').item(0)
      let script1 = document.createElement('script')
      let videoData = { // 需要保存数据
        'duration': 0,
        'position': 0,
        'tail': false
      }
      script1.type = 'text/javascript'
      script1.src = `${this.filedata.baseStatic}common/ckplayer/ckplayer/ckplayer.js`
      oHead.appendChild(script1)
      setTimeout(function () {
        var videoObject = {
          container: '.video', // “#”代表容器的ID，“.”或“”代表容器的class
          variable: 'player', // 该属性必需设置，值等于下面的new chplayer()的对象
          autoplay: false, // 自动播放
          seek: `${_this.filedata.start}`,
          poster: `${_this.poster}`,
          video: `${_this.src}`, // 视频地址
          loaded: 'loadedHandler1'
        }
        loadedmetadata = function loadedmetadata() {
          let metaData = player.getMetaDate()
          playertime = metaData['duration']
        }
        timeUpdateHandler = function timeUpdateHandler (time) {
          videoData.position = time
          if (time >= (0.8 * playertime)) {
            videoData.tail = true
          }
          _this.$emit('setData', videoData)
        }
        playHandler = function playHandler () {
          clearInterval(_this.timer)
          _this.timer = setInterval(function () {
            videoData.duration += 0.1
          }, 100)
        }
        pauseHandler = function pauseHandler () {
          clearInterval(_this.timer)
        }
        window.player = new ckplayer(videoObject)
        window.loadedHandler1 = function () {
          player.addListener('play', playHandler) // 监听暂停播放
          player.addListener('pause', pauseHandler) // 监听暂停播放
          player.addListener('time', timeUpdateHandler) // 监听播放时间
          player.addListener('loadedmetadata', loadedmetadata) // 监听元数据
        }
      }, 100)
    }
  }
}
</script>
<style scoped>

</style>
