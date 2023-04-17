<template>
  <el-form label-width="100px">
    <el-form-item label="点位ID:">
        <el-input v-model="addInfor.id" disabled></el-input>
      </el-form-item>
    <el-form-item label="x坐标:">
        <el-input v-model="addInfor.x" :disabled="!disabledSave"></el-input>
      </el-form-item>
      <el-form-item label="y坐标:">
        <el-input v-model="addInfor.y" :disabled="!disabledSave"></el-input>
      </el-form-item>
      <el-form-item label="名称:">
        <el-input v-model="addInfor.name" :disabled="!disabledSave"></el-input>
      </el-form-item>
      <el-form-item label="磁钉点间距:" v-if="addInfor.magInterval">
        <el-input v-model="addInfor.magInterval" :disabled="!disabledSave"></el-input>
      </el-form-item>
      <el-form-item label="类型:" v-if="addInfor.value">
        <el-select v-model="addInfor.value" :disabled="!disabledSave">
          <el-option
            v-for="item in addInfor.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理模式:" v-if="addInfor.otherValue">
        <el-select v-model="addInfor.otherValue" :disabled="!disabledSave">
          <el-option
            v-for="item in addInfor.otherOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
      handler(n, o) {
        this.addInfor = n
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
