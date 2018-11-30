<template>
  <div class="login_wrap">
    <el-form class="login_form" label-position="top" :model="loginForm">
      <h2>登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="login_btn" @click.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      loginForm: {
        password: '',
        username: ''
      }
    }
  },
  methods: {
    // 登录
    async handleLogin () {
      // 将数据发给后端接收响应
      let { data: { data: { token }, meta: { msg, status } } } = await this.$http.post('login', this.loginForm)
      if (status === 200) {
        // 成功
        this.$message.success(msg)
        // 写入token
        localStorage.setItem('token', token)
        this.$router.push({ path: '/' })
      } else {
        this.$message.error(msg)
      }
    }

  }
}
</script>
<style>
  .login_wrap {
    display: flex;
    height: 100%;
    background: black;
    justify-content: center;
    align-items: center;
  }

  .login_form {
    overflow: hidden;
    width: 500px;
    padding: 0px 30px 30px 30px;
    background: #ffffff;
    border-radius: 6px;
  }

  .login_btn {

    width: 100%;
  }
</style>
