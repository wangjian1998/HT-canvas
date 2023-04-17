<template>
  <div>
    <canvas id="tutorial" width="1000" height="550" style="z-index:100;display:block;position:absolute;"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      x: 0,
      y: 0,
      r: 0
    }
  },

  methods: {
   
  }
}
</script>

<style lang="less" scoped>
canvas {
      border: 1px solid black;
    }
</style>
