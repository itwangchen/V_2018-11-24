<template>
    <el-card class="box-card">
        <el-card slot="header" class="clearfix">
            <!-- 头 -->
            <el-breadcrumb separator-class="el-icon-arrow-right" class="top_title">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-table  height="600" stripe class="tableB" border :data="rightList" style="width: 100%" current-row-key>
                <el-table-column type="index" prop="id" label="#" >
                </el-table-column>
                <el-table-column prop="authName" label="权限名称" >
                </el-table-column>
                <el-table-column prop="path" label="路径" >
                </el-table-column>
                <el-table-column label="层级">
                    <template slot-scope="scope">
                       
                            {{scope.row.level | cengJ}}
                      

                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </el-card>
</template>
<script>
    export default {
        name: "",
        data() {
            return {
                rightList: []

            };
        },
        filters: {
            'cengJ': function (i) {
              
                
                var  nums
                switch (i-0) {
                    case 0:
                    nums = '一'
                        break;
                    case 1:
                    nums = '二'
                        break;
                    case 2:
                    nums = '三'
                        break;
                    case 3:
                    nums = '四'
                        break;
                    case 4:
                    nums = '五'
                        break;
                    case 5:
                        nums = '六'
                        break;
                }
                return nums + '级'
            }
        },
       async beforeCreate() {
            // // 写入token
            this.$http.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            let { data: { data, meta: { msg, status } } } = await this.$http.get(`rights/list`)
            if (status === 200) {
                this.rightList = data                
            }
        }
    }
</script>
<style scoped>
    .tableB {
        text-align: center;
        margin-top: 20px;
    }

</style>