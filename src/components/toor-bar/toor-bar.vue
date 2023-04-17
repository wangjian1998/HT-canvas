<template>
  <ul>
    <li :id="item.elId" class="icon-wrapper" v-for="item in toorbar" :key="item.id" @click="onClick(item)">
      <el-tooltip class="item" effect="dark" :content="item.content" placement="right">
        <i class="iconfont icon" :class="item.icon"></i>
      </el-tooltip>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    toorbar: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // toorbar: [
      //   {id: 1, icon: 'icon-quanping', content: '全屏', click: null, elId: 'fullscreenbtn'},
      //   {id: 2, icon: 'icon-fangda', content: '放大', click: this.zoomIn},
      //   {id: 3, icon: 'icon-suoxiao', content: '缩小', click: this.zoomOut},
      //   {id: 4, icon: 'icon-gonglu', content: '路径全选', click: this.onShowSite},
      //   {id: 5, icon: 'icon-Icon_lujinghuizhi', content: '路径绘制', click: this.play},
      //   {id: 6, icon: 'icon-dianweipeizhi', content: '显示点位', click: this.showPoint},
      //   {id: 7, icon: 'icon-zhongzhi', content: '重置', click: this.reset},
      // ]
    }
  },

  methods: {
    onClick(data) {
      this.$emit('onClick', data)
    },
    // fullscreen() {
    //   this.$emit('fullscreen')
    // },
    // zoomIn() {
    //   this.$emit('zoomIn')
    // },
    // zoomOut() {
    //   this.$emit('zoomOut')
    // },
    // showPoint() {
    //   this.$emit('showPoint')
    // },
    // onShowSite() {
    //   this.$emit('onShowSite')
    // },
    // play() {
    //   this.$emit('play')
    // },

    // reset() {
    //   this.$emit('reset')
    // },
  }
}
</script>

<style lang="less" scoped>
  .icon-wrapper {
    width: 32px;
    height: 32px;
    border: 0.01rem solid #008bd5;
    box-shadow: 5px 5px 10px -4px rgba(0,0,0,.1);
    background: #fff;
    text-align: center;

    .icon {
      font-size: 20px;
      padding-top: 6px;
      display: inline-block;
    }
  }
</style>
