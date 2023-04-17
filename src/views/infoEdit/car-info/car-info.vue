<template>
  <div class="car-info">
    <!-- <search-bar></search-bar> -->
    <div class="topleft">
      <el-form :model="form" label-width="80px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="活动名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="活动区域">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="handle-btns">
        <el-button icon="el-icon-refresh" @click="handleResetClick"
          >重置</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleQueryClick"
          >搜索</el-button
        >
      </div>
    </div>

  </div>
</template>

<script>
import SearchBar from '@/components/search-bar'
export default {
  components: {SearchBar},
  data() {
    return {
      form: {
        name: '',
        region: ''
      }
    }
  },

  methods: {
    handleResetClick() {

    },

    handleQueryClick() {

    }
  }
  
}
</script>

<style lang="less" scoped>
.topleft {
  display: flex;
}
</style>
