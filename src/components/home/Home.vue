<template>
  <el-container class="container">
    <el-header class="header">
    <el-row>
      <el-col :span="4">
        <img src="../../assets/logo.png" >
      </el-col>
      <el-col :span="19">
        <h2>电商管理后台</h2>
      </el-col>
      <el-col :span="1">
        <a href="javascript:;" class="login_out" @click.prevent="handelLoginOut">退出</a>
      </el-col>
    </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
  export default {
    name: '',
    data() {
      return {

      }
    },
    beforeCreate() {
      // token验证
      if (!localStorage.getItem('token')) {
        this.$router.push({ path: '/login' })
        //提示登录
        this.$message.error('请登录!')
      }
    },
    methods:{
      handelLoginOut(){
        //清除token
        localStorage.clear();
        //跳转到登录页面
        this.$router.push({path:'/login'})
        this.$message.success('退出成功!')
      }
    }
  }
</script>
<style scoped>
  .container {
    height: 100%;
  }

  .header {
    background-color: #b3c0d1;
  }

  .aside {
    background-color: #d3dce6;
  }

  .main {
    background-color: #e9eef3;
   
  }
  h2 {
    text-align: center;
    line-height:20px;
  }
  .login_out {
    text-decoration: none;
    color:brown; 
    line-height: 60px;
  }
</style>