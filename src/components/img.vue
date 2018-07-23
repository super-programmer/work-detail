<template>
  <div>
    <img v-bind:src="imgsrc">
  </div>
</template>
<script>
export default {
  name: 'doc',
  props: ['src','filedata'],
  data () {
    return {
      imgsrc: ''
    }
  },
  mounted(){
    // 添加域名
    this.imgsrc = `${this.filedata.baseUrl}${this.src}`

  }
}
</script>

<style scoped>
</style>
