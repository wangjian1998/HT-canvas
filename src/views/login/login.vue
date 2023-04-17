<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login" v-loading="loading">
     <div class="login-panel">
      <h1 class="title">后台管理系统</h1>
      <el-tabs type="border-card" stretch v-model="currentTab">
      <el-tab-pane name="account">
        <template #label>
        <span><i class="el-icon-user-solid"></i> 账号登录</span>
        </template>
        <!-- <login-account ref="accountRef" /> -->
        <div class="login-account">
          <el-form label-width="60px" :rules="rules" :model="account" ref="formRef">
          <el-form-item label="账号" prop="UserName">
            <el-input v-model="account.UserName" />
          </el-form-item>
          <el-form-item label="密码" prop="PW">
            <el-input v-model="account.PW" show-password />
          </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      </el-tabs>
      <div class="account-control">
      <el-checkbox v-model="isKeepPassword">记住密码</el-checkbox>
      <el-link type="primary">忘记密码</el-link>
      </div>
      <el-button type="primary" class="login-btn" @click="onSubmit('formRef')">立即登录</el-button>
    </div>
  </div>
</template>

<script>
import {loginApi} from '@/service/api'
export default {
  // components: {loginAccount},
  data() {
    return {
      loading: false,
      currentTab: 'account',
      isKeepPassword: localStorage.getItem('UserName') ? true : false,
      account: {
        UserName: localStorage.getItem('UserName') ?? '',
        PW: localStorage.getItem('PW') ?? ''
      },

      rules: {
        UserName: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
          PW: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
      }
    }
  },

  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid)=>{
        this.loading = true
        if (valid) {
          // 判断是否记住密码
          if (this.isKeepPassword) {
            localStorage.setItem('UserName', this.account.UserName)
            localStorage.setItem('PW', this.account.PW)
          }else {
            localStorage.removeItem('UserName', this.account.UserName)
            localStorage.removeItem('PW', this.account.PW)
          }

          loginApi(this.account).then(res => {
            console.log(res)
            if (res.state !== 200) {
              this.loading = false
              this.$message({
              message: '用户名或者密码错误',
              type: 'error'
            })
            }else {
              this.$message({
              message: '登录成功',
              type: 'success'
              })
              this.loading = false
              localStorage.setItem('account', JSON.stringify(this.account))
              this.$router.push('main')
            }
            
            // const localAccount = JSON.parse(localStorage.getItem('account'))
            // if (localAccount.UserName === 'admin') {
            //   this.$router.push('totalInstall')
            // } else if (localAccount.UserName === 'admin1') {
            //   this.$router.push('separateInstall')
            // }
            // else if (localAccount.UserName === 'admin3') {
            //   this.$router.push('main')
            // }
          }).catch(()=> {
            this.$message({
              message: '账号或密码错误',
              type: 'error'
            })
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
  
}
</script>

<style lang="less" scoped>
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .login-panel {
      margin-bottom: 150px;
      width: 320px;
      .title {
        text-align: center;
        margin-bottom: 20px;
      }

      .account-control {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
      }

      .login-btn {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
</style>
