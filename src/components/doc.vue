<template>
  <div>
    <img v-for="item in list" v-bind:src="item">
  </div>
</template>
<script>
export default {
  name: 'doc',
  props: ['pages','filedata'],
  data () {
    return {
      list: []
    }
  },
  mounted(){
    // 添加域名
    var _this = this
    this.pages.map(function (item) {
      _this.$data.list.push(`${_this.filedata.baseUrl}${item}`)
    })
  }
}
</script>

<style scoped>
</style>
