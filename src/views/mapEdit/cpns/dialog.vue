<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <el-form :model="form" :rules="rules" ref="ruleForm" class="form">
      <el-form-item label="增加点位类型" :label-width="formLabelWidth" prop="siteType">
        <el-select v-model="form.siteType" placeholder="请选择增加的点位类型">
          <el-option
            v-for="item in form.siteOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="增加点位个数" :label-width="formLabelWidth" prop="num">
        <el-input v-model.number="form.num" placeholder="请输入新增个数"></el-input>
      </el-form-item>
      <el-form-item label="点位间距" :label-width="formLabelWidth" prop="spacing">
        <el-input v-model.number="form.spacing" placeholder="请输入点位间距"></el-input>
      </el-form-item>
      <el-form-item label="排列方式" :label-width="formLabelWidth" prop="rankValue">
        <el-select v-model="form.rankValue" placeholder="请选择排列方式">
          <el-option
            v-for="item in form.rankOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <i :class="item.icon"></i>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起始x坐标" :label-width="formLabelWidth">
        <span>{{ startX }}</span>
      </el-form-item>
      <el-form-item label="起始y坐标" :label-width="formLabelWidth">
        <span>{{startY }}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onDefine('ruleForm')">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    startX: {
      type: Number,
      default: 0
    },
    startY: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      form: {
        siteType: '',
        rankValue: '',
        siteOptions: [
          {label: '节点', value: '1'},
          {label: '站点', value: '2'},
          {label: '磁钉点', value: '3'},
          {label: '功能点', value: '4'},
        ],
        rankOptions: [
          {label: '←', value: '1', icon: 'el-icon-back'},
          {label: '→', value: '2', icon: 'el-icon-right'},
          {label: '↑', value: '3', icon: 'el-icon-top'},
          {label: '↓', value: '4', icon: 'el-icon-bottom'},
        ],
        num: null,
        spacing: null
      },
      rules: {
        siteType: [
          { required: true, message: '请选择增加的点位类型', trigger: 'change' }
        ],
        num: [
          { required: true, message: '请输入批量增加的个数', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^(?:[1-9]\d*)$/.test(value) == false) {
                callback(new Error("请输入正整数"));
              } else {
                callback();
              }
            },
            type: "number", trigger: "blur" }
        ],
        spacing: [
          { required: true, message: '请输入每个点位之间的距离', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              if (/^(?:[1-9]\d*)$/.test(value) == false) {
                callback(new Error("请输入正整数"));
              } else {
                callback();
              }
            },
            type: "number", trigger: "blur" }
        ],
        rankValue: [
          { required: true, message: '请选择绘制方向', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ]
      },
      formLabelWidth: '120px'
    }
  },

  methods: {
    onCancel() {
      this.$emit('onCancel', false)
    },

    onDefine(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('onDefine', this.form)
        } else {
          console.log('error submit!!');
          return false
        }
      });
    },

    // 表单数据重置
    dataReset() {
      Object.assign(this.$data.form, this.$options.data().form);
    }
  }
}
</script>

<style lang="less" scoped>
  .form {
    width: 400px;
    margin: auto;
  }
  /deep/.el-form-item__content {
    width: 200px;
  }
</style>
