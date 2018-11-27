<template>
    <el-card class="box-card">
        <el-card slot="header" class="clearfix">
            <!-- 头 -->
            <el-breadcrumb separator-class="el-icon-arrow-right" class="top_title">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 搜索 -->
            <el-row>
                <!-- 添加 -->
                <el-col :span="3" class="additem">
                    <el-button type="success" @click="addFormVisible = true" class="serach" plain>添加角色</el-button>
                    <!-- 添加弹出层 -->

                    <el-dialog title="添加角色" :visible.sync="addFormVisible">
                            <el-form class="editWrap" :label-position="leftposition" label-width="80px" :model="roleForm">
                                <el-form-item label="角色名">
                                    <el-input v-model="roleForm.roleName"></el-input>
                                </el-form-item>
                                <el-form-item label="描述">
                                    <el-input v-model="roleForm.roleDesc"></el-input>
                                </el-form-item>

                                <el-button type="primary" class="editBtn" @click="addItem">确定</el-button>
                                <el-button class="editBtn" @click="addNo">取消</el-button>
                            </el-form>
                          

                        </el-dialog>
                   
                </el-col>
            </el-row>
            <template>
                <el-table class="tabelB" :data="rolesList" border style="width: 100%" current-row-key>
                    <!-- id: 30
                            roleDesc: "技术负责人"
                            roleName: "主管" -->
                    <el-table-column type="expand" prop="children" label="" width="60">
                        <template slot-scope="props1">
                            <el-row v-if="props1.row.children.length==0">无权限</el-row>
                            <el-row v-for="(tag,i1) in props1.row.children" :key="tag.id" class="role1">
                                <el-col :span=4>

                                    <!-- 一级权限 -->
                                    <el-tag type="tag.success" :closable="true" :disable-transitions="false" @close="handleClose1(props1.row,i1)">
                                        {{tag.authName}}
                                    </el-tag>
                                </el-col>
                                <el-col :span="20" class="role2">
                                    <el-row v-for="(tag,i2) in tag.children" :key="tag.id">
                                        <el-col :span="4">

                                            <!-- 二级权限 -->
                                            <el-tag :closable="true" :disable-transitions="false" @close="handleClose2(props1.row,i1,i2)"
                                                type="danger"> {{tag.authName}}

                                            </el-tag>
                                        </el-col>
                                        <el-col :span='20'>

                                            <!-- 三级级权限 -->
                                            <el-tag :closable="true" :disable-transitions="false" @close="handleClose3(props1.row,i1,i2,i3)"
                                                class="role3" v-for="(tag,i3) in tag.children" :key="tag.id" type="info">
                                                {{tag.authName}}

                                            </el-tag>

                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" prop="id" label="#" width="80">
                    </el-table-column>
                    <el-table-column prop="roleName" label="名称">
                    </el-table-column>
                    <el-table-column prop="roleDesc" label="描述">
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column label="操作">
                        <template slot-scope="props">
                            <!-- 编辑 -->
                            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="handleEdit(props.row.id)"></el-button>
                            <!-- 权限选择 -->
                            <el-button type="success" icon="el-icon-check" circle size="mini" @click="handleRole(props.row)"></el-button>
                            <!-- 权限操作 -->
                            <!-- 删除 -->
                            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="handleDelete(props.row.id)"></el-button>
                            <el-dialog title="添加用户" :visible.sync="rolesFormVisible">
                                <el-tree :data="rolesItem.data" show-checkbox node-key="id" ref="tree"
                                    default-expand-all :default-checked-keys="checkdList" :props="defaultProps">
                                </el-tree>
                                <div slot="footer" class="dialog-footer">
                                    <el-button @click="handleRolesN">取 消</el-button>
                                    <el-button type="primary" @click="handleRolesO">确 定</el-button>
                                </div>
                            </el-dialog>
                            <!-- 编辑角色 -->
                            <el-dialog title="编辑用户" :visible.sync="EditFormVisible">
                                <el-form class="editWrap" :label-position="leftposition" label-width="80px" :model="roleForm">
                                    <el-form-item label="角色名">
                                        <el-input v-model="roleForm.roleName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="描述">
                                        <el-input v-model="roleForm.roleDesc"></el-input>
                                    </el-form-item>

                                    <el-button type="primary" class="editBtn" @click="handleEditOK">确定</el-button>
                                    <el-button class="editBtn" @click="editNO">取消</el-button>
                                </el-form>

                            </el-dialog>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-card>
    </el-card>
</template>
<script>
    export default {
        data() {
            return {
                rolesList: [],
                rolesItem: {},
                addFormVisible: false,
                rolesFormVisible: false,
                // 权限树参数[配置]
                defaultProps: {
                    children: 'children',
                    label: 'authName',
                },
                checkdList: [],
                checkdId: '',
                EditFormVisible: false,
                roleForm: {},
                leftposition: 'left'
            }
        },
        created() {
            // // 写入token
            this.$http.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.getTers()
        },
        methods: {
            //添加角色            
            async addItem() {
                let { data: { meta: { msg, status } } } = await this.$http.post('roles', this.roleForm)
                // 添加结果处理
                if (status === 201) {
                    this.addFormVisible = false
                    this.$message.success(msg)
                    this.roleForm = {}
                } else {
                    this.$message.error(msg)
                }
                this.getTers()
             },
             //取消编辑
             addNo(){
                 this.roleForm={}
                 this.addFormVisible=false
             },
            //确认编辑
            editNO() {
                this.roleForm = {}
                this.EditFormVisible = false


            },
            //取消编辑
            async  handleEditOK() {
                let res = await this.$http.put(`roles/${this.roleForm.roleId}`, this.roleForm)
                this.EditFormVisible = false
                console.log(res);
                this.getTers()

            },
            //删除角色
            handleDelete(I) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let { data: { meta: { status, msg } } } = await this.$http.delete(`roles/${I}`)
                    if (status === 200) {
                        this.getTers()
                        this.$message({
                            type: 'success',
                            message: msg
                        })
                    } else {
                        this.$message({
                            type: 'info',
                            message: msg
                        })
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消删除'
                    })
                })
            }
            ,
            // 编辑角色
            async handleEdit(I) {


                let res = await this.$http.get(`roles/${I}`)
                if (res.data.meta.status === 200) {
                    this.EditFormVisible = true
                    console.log(res);
                    // 弹出层
                    this.roleForm = res.data.data

                } else {
                    this.$message.error(res.data.meta.msg)
                }
            },
            async getTers() {
                // 获取权限列表
                let res = await this.$http.get(`roles`)
                let { data, meta: { status, msg } } = res.data
                if (status === 200) {
                    this.rolesList = data
                }

            },
            //将点击权限编辑的项目的权限数据赋值给data中的rolesItem
            async handleRole(item) {
                this.checkdId = item.id
                let list = []
                //点击打开编辑权限
                let res = await this.$http.get(`rights/tree`)
                if (res.data.meta.status === 200) {
                    //item 是当前角色的权限数据,由外到内找到ID,存储权限ID
                    item.children.forEach(e => {
                        e.children.forEach(e => {
                            e.children.forEach(e => {
                                list.push(e.id)
                            })
                        })
                    });
                    this.checkdList = list
                    // console.log(list);
                    // console.log(item.children);
                    this.rolesItem = res.data
                    this.rolesFormVisible = true
                }
            },
            //确认编辑权限
            async handleRolesO() {
                this.rolesFormVisible = false
                //获取到选中的id 数组
                let listChecked = this.$refs.tree.getCheckedKeys().join(',')
                //角色id
                let thisId = this.checkdId
                let { data: { meta: { msg, status } } } = await this.$http.post(`roles/${thisId}/rights`, { rids: listChecked })
                if (status === 200) {
                    this.getTers()
                    this.$message.success(msg)
                    this.getTers()
                } else {
                    this.$message.error(msg)
                }
            },
            handleRolesN() {
                this.rolesFormVisible = false

            },
            //接收传入的当前行的表格数据props.row 进行操作 改变数据 驱动视图改变
            handleClose1(item, i) {
                item.children.splice(i, 1)
            },
            handleClose2(item, i, i2) {
                item.children[i].children.splice(i2, 1)
            },
            handleClose3(item, i, i2, i3) {
                item.children[i].children[i2].children.splice(i3, 1)
            }
        },

    }
</script>
<style scoped>
    .additem {
        margin-top: 20px;
    }

    .role1 {
        margin-bottom: 10px;
    }

    .role2 {
        margin-bottom: 10px;
    }

    .role3 {
        margin: 0 5px 5px 0;
    }

    .tabelB {
        margin-top: 20px;
    }

    .editBtn {
        float: right;
        margin-left: 10px;
    }

    .editWrap {
        overflow: hidden;
    }
</style>