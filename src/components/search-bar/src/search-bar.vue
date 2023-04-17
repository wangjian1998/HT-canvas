<template>
  <div class="search-bar">
    <el-form>
      <el-row>
        <el-col v-for="item in formItems" :span="10" :key="item.label">
          <el-form-item :label="item.label">
            <el-input 
              v-if="item.type === 'input'"
              :placeholder="item.placeholder"
              v-model="item.filed"
            >
            </el-input>
            <el-select 
              v-if="item.type === 'select'"
              :placeholder="item.placeholder"
              v-model="item.filed"
            >
              <el-option 
                v-for="option in item.options" 
                :key="option.value" 
                :label="option.label" 
                :value="option.value">
              </el-option>
            </el-select>
            
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="less" scoped>

</style>
