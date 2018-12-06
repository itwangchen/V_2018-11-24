<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 头 -->
      <!-- 将头部抽离出来设置为全局组件 -->
      <my-bread level1="用户管理" level2="用户列表">

      </my-bread>

      <!-- 搜索 -->
      <el-row>
        <el-col :span="12" class="userserach">
          <el-input v-model="search_Input" placeholder="请输入内容"></el-input>
          <el-button icon="el-icon-search" type="success" @click.prevent="handleSearch"></el-button>
        </el-col>
        <!-- 添加 -->
        <el-col :span="3">
          <el-button type="success" @click="addFormVisible = true" class="serach" plain>Add</el-button>
          <!-- 添加用户弹出层 -->
          <el-dialog title="添加用户" :visible.sync="addFormVisible">
            <el-form :model="userForm" label-position="left">
              <el-form-item label="用户名">
                <el-input v-model="userForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="userForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="userForm.mobile"></el-input>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addNo">取 消</el-button>
              <el-button type="primary" @click="addItem">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <template>
        <el-table v-loading="loading" :data="tableData" style="width: 100%" current-row-key>
          <el-table-column type="index" prop="id" label="#" width="50">
          </el-table-column>
          <el-table-column prop="username" label="姓名">
          </el-table-column>
          <el-table-column prop="email" label="邮箱">
          </el-table-column>
          <el-table-column prop="mobile" label="电话">
          </el-table-column>
          <el-table-column label="创建日期">
            <template slot-scope="scope">
              {{scope.row.create_time | fData}}
            </template>
          </el-table-column>
          <el-table-column label="用户状态">
            <template slot-scope="props">
              <el-switch v-model="props.row.mg_state" active-color="#13ce66" @change="handleState(props.row.mg_state,props.row.id)"
                inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="props">
              <!-- 编辑 -->
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="handleEdit(props.row)"></el-button>
              <!-- 角色 -->
              <el-button type="success" icon="el-icon-check" circle size="mini" @click="handleRole(props.row)"></el-button>
              <!-- 删除 -->
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="handleDelete(props.row.id)"></el-button>
              <!-- 编辑弹出层 -->
              <el-dialog title="编辑用户" :visible.sync="EditFormVisible">
                <el-form class="editWrap" :label-position="leftposition" label-width="80px" :model="userForm">
                  <el-form-item label="用户名">
                    <el-input v-model="userForm.username" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="userForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="电话">
                    <el-input v-model="userForm.mobile"></el-input>
                  </el-form-item>
                  <el-button type="primary" class="editBtn" @click="handleEditOK">确定</el-button>
                  <el-button class="editBtn" @click="editNO">取消</el-button>
                </el-form>

              </el-dialog>
              <!-- 角色弹出层 -->
              <el-dialog title="角色选择" :visible.sync="RoleFormVisible">
                用户名:
                {{checkedUsername}}
                <el-select v-model="region" placeholder="角色选择">
                  <el-option label="请选择" :value="-1"></el-option>
                  <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in RoleList"></el-option>
                </el-select>
                <el-button type="primary" class="editBtn" @click="handleRoleOK(props.row.id)">确定</el-button>
                <el-button class="editBtn" @click="RoleFormVisible=false">取消</el-button>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template>
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="thisPageNum"
            :page-sizes="page_sizes" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </el-pagination>
        </div>
      </template>
    </div>
  </el-card>
</template>
<script>
export default {
  data () {
    return {
      loading:true,
      // 表格数据
      tableData: [],
      // 角色
      RoleList: [],
      pagenum: 1,
      pagesize: 6,
      search_Input: '',
      // 增加层弹出状态
      addFormVisible: false,
      // 编辑弹出层状态
      EditFormVisible: false,
      // 角色弹出层状态
      RoleFormVisible: false,
      // 角色id
      region: -1,
      checkedUsername: '',
      // 被设置的用户的Id
      RoleId: 0,
      // 增加数据/编辑用户
      userForm: {},
      thisPageNum: 1,
      // 设置可选择条数
      page_sizes: [6, 12, 18],
      // 数据条数
      total: 1,
      statusB: true,
      leftposition: 'left'
    }
  },
  beforeMount () {
    this.getList()
  },
  methods: {
    // 获取用户列表方法
    async   getList (pagenum, pagesize, search_Input) {
      // 默认搜索空,获取全部数据
      let { data: { data: { users, total }, meta: { msg, status } } } = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.search_Input}`)
      if (status === 200) {
        this.tableData = users      
        // 总数据条数
        this.total = total
        // 重置页码
        this.pagenum = 1
        this.loading=false
      } 
    },
    // // 添加用户
    async addItem () {
      let { data: { meta: { msg, status } } } = await this.$http.post('users', this.userForm)
      // 添加结果处理
      if (status === 201) {
        this.addFormVisible = false
        this.$message.success(msg)
        this.getList()
        // 清空输入框
        this.userForm = {}
      } else {
        this.$message.error(msg)
      }
    },
    // 取消添加
    addNo () {
      this.userForm = {}
      this.addFormVisible = false
    },

    // 分页更改
    handleSizeChange (val) {
      // 重置页码
      this.pagenum = 1
      this.pagesize = val
      this.getList()
    },
    // 页数跳转
    handleCurrentChange (val) {
      this.pagenum = val
      this.getList()
    }, // 搜索功能
    async  handleSearch () {
      this.getList()
    },
    // 状态改变
    async handleState (state, I) {
      let { data: { meta: { msg, status } } } = await this.$http.put(`users/${I}/state/${state}`)
      if (status == 200) {
        this.$message.success(msg)
        this.getList()
      } else {
        this.$message.error(msg)
      }
    },

    // 删除
    handleDelete (I) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: { meta: { status, msg } } } = await this.$http.delete(`users/${I}`)
        if (status === 200) {
          this.getList()
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
    },
    // 编辑
    async handleEdit (user) {
      // 弹出层
      this.EditFormVisible = true
      this.userForm = user
    },
    // 确认编辑
    async handleEditOK () {
      // 当前editForm 中存在Id 是点击编辑的时候获取的
      let { data: { meta: { msg, status } } } = await this.$http.put(`users/${this.userForm.id}`, this.userForm)
      if (status === 200) {
        this.$message.success(msg)
        this.EditFormVisible = false
        this.getList()
      } else {
        this.$message.error(msg)
      }
      // 清空输入框
      this.userForm = {}
    },

    // 取消编辑
    editNO () {
      this.userForm = {}
      this.EditFormVisible = false
    },
    // 角色编辑
    async handleRole (user) {
      this.RoleId = user.id
      this.checkedUsername = user.username
      // 查询角色列表
      let { data: { data, meta: { msg, status } } } = await this.$http.get(`roles`)
      // 查询用户信息获取角色信息
      let r = await this.$http.get(`users/${user.id}`)
      if (status === 200 && r.data.meta.status === 200) {
        this.RoleList = data
        this.RoleFormVisible = true

        this.region = r.data.data.rid
      }
    },
    // 确认选择角色
    async  handleRoleOK () {
      this.RoleFormVisible = false
      let userId = this.RoleId
      let rId = this.region
      console.log(userId, rId)

      let res = await this.$http.put(`users/${userId}/role`, { rid: rId })

      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.error(res.data.meta.msg)
      }
    }
  }
}
</script>
<style scoped>
  .userserach {
    display: flex;
  }

  .serach {
    margin-left: 20px;
  }

  .top_title {
    margin-bottom: 20px;
  }

  .editBtn {
    float: right;
    margin-left: 10px;
  }

  .editWrap {
    overflow: hidden;
  }
</style>
