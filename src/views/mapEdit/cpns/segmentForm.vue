<template>
  <el-form label-width="80px" class="form-content">
    <el-form-item label="线段ID:">
        <el-input v-model="addInfor.segmentId" disabled></el-input>
      </el-form-item>
    <el-form-item label="名称:">
        <el-input v-model="addInfor.segmentName" :disabled="!disabledSave"></el-input>
      </el-form-item>
      <el-form-item label="长度:">
        <el-input v-model="addInfor.length" disabled></el-input>
      </el-form-item>
      <el-form-item label="是否双向:">
        <el-checkbox v-model="addInfor.directionality" :disabled="!disabledSave"></el-checkbox>
      </el-form-item>
      <el-form-item label="开始Id:">
        <el-input v-model="addInfor.startNodeId" disabled></el-input>
      </el-form-item>
      <el-form-item label="结束Id:">
        <el-input v-model="addInfor.endNodeId" disabled></el-input>
      </el-form-item>
      <el-form-item label="最大速度:">
        <el-input v-model="addInfor.maxSpeed" :disabled="!disabledSave"></el-input>
      </el-form-item>
      <el-form-item label="旋转角度:" v-if="addInfor.rotAngle">
        <el-input v-model="addInfor.rotAngle" :disabled="!disabledSave"></el-input>
      </el-form-item>
      <el-form-item label="是否顺时针旋转:" v-if="addInfor.isClockwiseDirection || addInfor.isClockwiseDirection === false">
        <el-checkbox v-model="addInfor.isClockwiseDirection" :disabled="!disabledSave"></el-checkbox>
      </el-form-item>
      <el-form-item label="控制点一X坐标:" v-if="addInfor.control1X">
        <el-input v-model="addInfor.control1X" :disabled="!disabledSave"></el-input>
      </el-form-item>
      <el-form-item label="控制点一Y坐标:" v-if="addInfor.control1Y">
        <el-input v-model="addInfor.control1Y" :disabled="!disabledSave"></el-input>
      </el-form-item>
      <el-form-item label="控制点二X坐标:" v-if="addInfor.control2X">
        <el-input v-model="addInfor.control2X" :disabled="!disabledSave"></el-input>
      </el-form-item>
      <el-form-item label="控制点二Y坐标:" v-if="addInfor.control2Y">
        <el-input v-model="addInfor.control2Y" :disabled="!disabledSave"></el-input>
      </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    addInfor1: {
      type: Object
    },

    disabledSave: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      addInfor: {}
    }
  },

  watch: {
    'addInfor1': {
      handler(n) {
        this.addInfor = n
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.form-content {
  height: 353px;
  overflow: auto;
}
</style>
