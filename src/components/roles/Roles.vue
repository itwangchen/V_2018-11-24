<template>
    <el-card class="box-card">
        <el-card slot="header" class="clearfix">
            <!-- 头 -->
            <el-breadcrumb separator-class="el-icon-arrow-right" class="top_title">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-card>
    </el-card>
</template>
<script>
    export default {       
        data() {
            return {

            };
        }
    }
</script>
<style scoped>

</style>