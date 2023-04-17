<template>
  <div class="nav-tabs">
    <el-tag
      :key="tag.id"
      v-for="(tag, index) in tags"
      :closable = 'index !== 0'
      :disable-transitions="false"
      @click = handleClick(tag)
      @close="handleClose(tag)">
      {{tag.name}}
    </el-tag>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tags: [
      {id: '1', name: '首页', components: 'Home', type: 1, icon: 'el-icon-platform-eleme'}
      ],
      tabsValue: '1'
    }
  },
  methods: {
    handleClick(tag) {
      console.log(tag)
    }
  }

}
</script>

<style lang="less" scoped>

</style>
