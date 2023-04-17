<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
        <component :is="item.component"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CarInfo from './car-info/car-info.vue'
import SiteInfo from './site-info/site-info.vue'
export default {
  components: {CarInfo, SiteInfo},
  data() {
    return {
      activeName: 'car',
      tabs: [
        {name: 'car', label: 'agv小车', component: 'car-info'},
        {name: 'site', label: '站点信息', component: 'site-info'},
      ]
    }
  }
}
</script>

<style lang="less" scoped>

</style>
