<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main">
    <el-container class="main-content">
      <el-aside :width="!isCollapse ? '210px' : '60px'">
        <nav-menu :collapse="isCollapse"></nav-menu>
      </el-aside>
      <el-container class="page">
        <el-header class="page-header">
          <nav-header @isCollapse="Collapse"></nav-header>
        </el-header>
        <el-main class="page-content">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import NavMenu from '@/components/nav-menu';
import NavHeader from '@/components/nav-header';

export default {
  components: {NavMenu, NavHeader},
  data() {
    return {
      isCollapse: false,
     
    }
  },
  methods: {
    Collapse(data) {
      this.isCollapse = data
    }
  }
}
</script>

<style lang="less" scoped>
  .main {
    width: 100%;
    height: 100%;
    .page {
      height: 100%;
      .page-header{
        height: 80px;
      }
      .page-content {
        padding: 10px;
      }
    }
  }
  .main-content {
    height: 100%;
  }

.el-header,
.el-footer {
  display: flex;
  color: #333;
  // text-align: center;
  align-items: center;
}

.el-header {
  height: 48px !important;
}

.el-aside {
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 200px;
  text-align: left;
  cursor: pointer;
  background-color: #001529;
  transition: width 0.3s linear;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none;
  }
}

.el-main {
  color: #333;
  text-align: center;
  background-color: #f0f2f5;
}
</style>
