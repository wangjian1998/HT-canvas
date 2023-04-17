<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2 class="title">姓名：
      <span class="titleName">{{name}}</span></h2>
      <el-button>Hhh</el-button>
  </div>
</template>

<script>
import {textApi} from '@/service/api'
export default {
  data() {
    return {
      name: 'wangjian'
    }
  },

  created() {
    this.getData()
  },

  methods: {
    getData() {
      const params = {name: 'wangjian'}
      textApi(params).then(res=> {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped lang="less">
 .title {
  color: red;
  .titleName {
    color: aqua;
  }
 }
</style>
