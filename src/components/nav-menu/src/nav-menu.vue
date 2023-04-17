<!-- eslint-disable vue/no-v-for-template-key -->
<template>
  <div class="nav-menu">
    <el-menu
      :default-active="defaultValue"
      background-color="#0c2135"
      text-color="#b7bdc3"
      active-text-color="#0a60bd"
      :collapse = 'collapse'
    >
      <template v-for="item in userMenus">
        <!-- 一级菜单 -->
        <template  v-if="item.type === 1">
          <el-menu-item :index="item.id + ''" :key="item.id">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </template>

        <!-- 二级菜单 -->
        <template v-if="item.type === 2">
          <el-submenu :index="item.id + ''" :key="item.id">
            <template slot="title">
                <i v-if="item.icon" :class="item.icon"></i>
                <span>{{ item.name }}</span>
            </template>
            <el-menu-item 
              :index="child.id + ''" 
              v-for="child in item.children" 
              :key="child.id"
              @click="handleMenuItemClick(child)"
            >
              <span>{{ child.name }}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </template>

    </el-menu>
  </div>
</template>

<script>
import bus from '@/utils/bus'
export default {
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userMenus: [
        {id: 1, name: '首页', components: 'totalInstall', type: 1, icon: 'el-icon-platform-eleme'},
        {id: 2, name: '仓库监控', type: 2, icon: 'el-icon-platform-eleme', children: [
          {id: 5, name: '地图操作', components: 'separateInstall', type: 3},
          {id: 6, name: '信息编辑', components: 'infoEdit', type: 3},
          {id: 11, name: '地图编辑', components: 'mapEdit', type: 3},
        ]},
        {id: 3, name: '仓库管理', type: 2, icon: 'el-icon-platform-eleme', children: [
          {id: 7, name: '货架入场', components: 'separateInstall', type: 3},
          {id: 8, name: '货架操作', components: 'totalInstall', type: 3},
        ]},
        {id: 4, name: '版本管理', type: 2, icon: 'el-icon-platform-eleme', children: [
          {id: 9, name: '机器人软件管理', components: 'separateInstall', type: 3},
          {id: 10, name: '机器人日志操作', components: 'totalInstall', type: 3},
        ]},
      ],
      defaultValue: '1'
    }
  },

  methods: {
    handleMenuItemClick(child){
      // this.emit('addTabs', child)
      // this.$router.push({path: child.components})
      this.$router.push({path: '/main/' + child.components})
      bus.$emit('addTags', child)
    }
  },

  mounted() {
    bus.$on('changeDefaultVal', data => {
      this.defaultValue = data.id + ''
    })
  }
}
</script>

<style lang="less" scoped>
  .el-menu {
    border-right: none;
  }

  // 目录
  .el-submenu {
    background-color: #001529 !important;
    // 二级菜单 ( 默认背景 )
    .el-menu-item {
      padding-left: 50px !important;
      background-color: #0c2135 !important;
    }
  }

  ::v-deep .el-submenu__title {
    background-color: #001529 !important;
  }

  // hover 高亮
  .el-menu-item:hover {
    color: #fff !important; // 菜单
  }

  .el-menu-item.is-active {
    color: #fff !important;
    background-color: #0a60bd !important;
  }

.el-menu-vertical:not(.el-menu--collapse) {
  width: 100%;
  height: calc(100% - 48px);
}
</style>
