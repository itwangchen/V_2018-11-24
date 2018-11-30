<template>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="top_title">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
  name: 'myBread',
  data () {
    return {

    }
  },
  props: ['level1', 'level2']
}
</script>
<style scoped>

</style>
