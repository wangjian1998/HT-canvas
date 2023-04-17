<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="nav-header">
    <div class="left">
      <i :class="!isFold ? 'el-icon-s-fold' : 'el-icon-s-unfold'" @click="onCollapse"></i>
    </div>
    <div class="center">
      <el-tag
        :key="tag.id" 
        v-for="(tag, index) in tags"
        :class="index === active ? 'active' : ''"
        :closable = 'index !== 0'
        :disable-transitions="false"
        @close="handleClose(tag)"
        @click="handleClick(tag, index)">
        {{tag.name}}
      </el-tag>
    </div>
    <div class="right">
      <user-info></user-info>
    </div>
  </div>
</template>

<script>
import UserInfo from './user-info.vue'
// import NavTabs from './nav-tabs.vue'
import bus from '@/utils/bus'
export default {
  components: {UserInfo},
  data() {
    return {
      isFold: false,
      tags: [
      {id: '1', name: '首页', components: 'Home', type: 1, icon: 'el-icon-platform-eleme'}
      ],
      tabsValue: '1',
      active: 1
    }
  },

  mounted() {
    bus.$on('addTags', data => {
      console.log(data)
      const bool = this.tags.some(item => item.id === data.id)
      if (!bool) {
        this.tags.push(data)
        this.active = this.tags.length - 1
      } else {
        this.active = this.tags.indexOf(data)
      }
      
    })
  },

  computed: {

  },

  methods: {
    onCollapse() {
      this.isFold = !this.isFold
      this.$emit('isCollapse', this.isFold)
    },

    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      let len = this.tags.length
      this.active = len - 1
      this.$router.push({path: this.tags[len - 1].components})
      bus.$emit('changeDefaultVal', this.tags[len - 1])
    },

    handleClick(tag, index) {
      console.log(tag)
      this.active = index
      this.$router.push({path: tag.components})
      bus.$emit('changeDefaultVal', tag)
    }
  }
}
</script>

<style lang="less" scoped>
  .nav-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .center {
      flex: 1;
      margin: 0 15px;
    }
  }

  .el-tag {
    margin: 0 4px;
    color: #333;
    cursor: pointer;
  }


  /deep/.el-tag .el-tag__close {
    color: #495060;
}
  .el-tag.active {
    color: #fff;
    border-color: #42b983;
    background: #42b983;
    position: relative!important;
    /deep/.el-tag__close {
      color: #fff;
    }
}
</style>
