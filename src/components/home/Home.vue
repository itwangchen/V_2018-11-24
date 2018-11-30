<template>
  <el-container class="container">
    <!-- header -->
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="../../assets/logo.png">
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
      <!-- aside -->
      <el-aside width="200px" class="aside">
        <el-menu class="menu"  :unique-opened="true" :router="true">
          <el-submenu :index="item.order" v-for="item in menus">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="ite.path" v-for="ite in item.children"> <i class="el-icon-menu"></i>{{ite.authName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
         
         
        </el-menu>
      </el-aside>
      <!-- main -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      menus:[]
    }
  },
 async beforeCreate () {
    // token验证
    if (!localStorage.getItem('token')) {
      this.$router.push({ path: '/login' })
      // 提示登录
      this.$message.error('请登录!')
    }
    //请求左侧栏目列表
 let res= await this.$http.get('menus')
let {data,meta:{msg,status}}=res.data
if ( status===200) {
  this.menus=data
  console.log(data);
}
  
  },
  methods: {
    handelLoginOut () {
      // 清除token
      localStorage.clear()
      // 跳转到登录页面
      this.$router.push({ path: '/login' })
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
    line-height: 20px;
  }

  .login_out {
    text-decoration: none;
    color: brown;
    line-height: 60px;
  }
  .menu {
    height: 100%;
  }
</style>
