<script setup lang="ts">
import { getRolePErmissionAPI, setRolePermissionAPI } from '@/api/permission'
import { addRoleAPI, deleteRoleAPI, getRoleAPI } from '@/api/user'
import { Edit, Delete, Tools, CaretRight } from '@element-plus/icons-vue'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { TreeType } from './index'
import { ElMessageBox } from 'element-plus'
const route = useRoute()
// 定义角色列表
const roleList = ref()
// 获取角色信息
const getRoleList = async () => {
  const res = await getRoleAPI()
  roleList.value = res.data.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  )
  tree.value = route.matched[0].children as any
  total.value = res.data.length
}
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const handleCurrentChange = (val: number) => {
  page.value = val
}
const handleSizeChange = (val: number) => {
  page.value = 1
  pageSize.value = val
}
// 定义树形组件的数据
const tree = ref<TreeType[]>()
onMounted(() => {
  getRoleList()
})
// 定义分配权限的显示与隐藏
const dialogVisible = ref(false)
const defaultProps = {
  children: 'children',
  label: (_: any, node: any) => {
    return node.data.name
  }
}
// 当前点击事件的id
const id = ref(0)
// 分配权限按钮回调
// 默认展开以及默认选中的节点
const defaultExpandedKeys = ref<any>({
  level1: [],
  level2: []
})

const permission = async (row: any) => {
  id.value = row.id
  rendering(id.value)
  dialogVisible.value = true
}

// 初始化渲染节点
const rendering = async (id: number) => {
  defaultExpandedKeys.value = {}
  const res = await getRolePErmissionAPI(id)
  if (res.data.length > 0) {
    defaultExpandedKeys.value.level1 =
      JSON.parse(res.data[0].level1) instanceof Array
        ? JSON.parse(res.data[0].level1)
        : [JSON.parse(res.data[0].level1)]

    defaultExpandedKeys.value.level2 =
      JSON.parse(res.data[0].level2) instanceof Array
        ? JSON.parse(res.data[0].level2)
        : [JSON.parse(res.data[0].level2)]

    tree.value.forEach((item: any) => {
      if (defaultExpandedKeys.value.level1.includes(item.name)) {
        item.meta.select = true
      }
      if (item.children) {
        item.children.forEach((item: any) => {
          if (defaultExpandedKeys.value.level2.includes(item.name)) {
            item.meta.select = true
          }
        })
      }
    })
  }
}

// 点击节点复选框的回调
const onCheck = () => {
  const datas = Tree.value.getCheckedNodes(false, true)

  selectList(datas)
}
const selectList = (data: any[]) => {
  newList.value = data.filter((item: any) => {
    // if (item.children && item.children.length > 0) selectList(item.children)
    item.meta.select = true
    return item.meta.select
  })
}

const Tree = ref<any>(null)
const newList = ref([])
const onTree = async () => {
  tree.value.forEach((item: any) => {
    const isItem = newList.value.some((item2: any) => item2.name === item.name)
    if (isItem) item.meta.select = true
    else item.meta.select = false
  })
  // 如果点击了节点之后点击确定才会切换，否则就提示用户未修改
  const level1 = tree.value
    .filter(
      (item: any) => item.meta.select // 查找当前节点的子节点中是否有选中的节点，如果有选中的节点那就筛选出来
    )
    .map((item: any) => item.name) // 之后将筛选出来的节点名称赋值给level1

  const level2 = newList.value
    .filter((item: any) => !level1.includes(item.name))
    .map((item: any) => item.name)

  const res = await setRolePermissionAPI({
    id: id.value,
    level1,
    level2
  })
  ElMessage.success(res.msg)

  dialogVisible.value = false
}

const roleDisplay = ref(false)

// 添加角色回调
const addRole = (row: { id: any }) => {
  roleForm.role = ''
  roleForm.describe = ''
  roleForm.id = ''

  // 打开弹出层
  roleDisplay.value = true
  nextTick(() => {
    roleRef.value.resetFields()
    if (row.id) {
      Object.assign(roleForm, row)
    }
  })
}
// 定义角色表单
const roleForm = reactive({
  role: '',
  describe: '',
  id: ''
})
// 定义表单校验规则
const roleRules = reactive({
  role: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  describe: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
})
// 绑定表单实例
const roleRef = ref(null)
// 添加角色表单提交
const createRole = async () => {
  await roleRef.value.validate()
  const res = await addRoleAPI(roleForm)
  ElMessage.success(res.msg)
  getRoleList()
  roleDisplay.value = false
}
const onHeader = (event: { id: number }) => {
  tree.value.forEach((item: any) => {
    item.children.forEach((item2: any) => {
      item2.meta.select = false
    })
    item.meta.select = false
  })

  rendering(event.id)
}

// 删除角色回调
const deleteRole = async (row: { id: number; role: string }) => {
  await ElMessageBox.confirm(
    '你是否要删除该角色，请注意，会清空该角色的任何权限！',
    '温馨提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  await deleteRoleAPI(row.id)
  ElMessage.success(row.role + '角色删除成功')
  getRoleList()
}
</script>
<template>
  <div>
    <!-- // 添加角色按钮 -->
    <div style="margin-bottom: 10px">
      <el-button type="primary" @click="addRole">添加角色</el-button>
    </div>
    <!-- 主体表格内容 -->
    <div>
      <el-table border :data="roleList" @expand-change="onHeader">
        <el-table-column type="expand">
          <el-row
            v-for="item in tree"
            :key="item.path"
            v-show="item.meta.select"
          >
            <el-col :span="12">
              <el-tag>{{ item.name }} </el-tag>
              <el-icon><CaretRight /></el-icon>
            </el-col>
            <el-col :span="6">
              <el-row
                v-for="children in item.children"
                :key="children.path"
                v-show="children.meta.select"
              >
                <el-col :span="12">
                  <el-tag type="success">
                    {{ children.name }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-table-column>
        <el-table-column prop="id" width="50" type="index" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="describe" label="角色描述" />
        <el-table-column prop="address" label="操作" align="center">
          <!-- eslint-disable-next-line vue/valid-attribute-name -->
          <template #="{ row }">
            <el-button :icon="Edit" type="primary" @click="addRole(row)"
              >编辑</el-button
            >
            <el-button :icon="Delete" type="danger" @click="deleteRole(row)"
              >删除</el-button
            >
            <el-button :icon="Tools" type="warning" @click="permission(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!-- 分配权限组件 -->
  <el-dialog title="分配权限" v-model="dialogVisible" destroy-on-close>
    <el-tree
      ref="Tree"
      show-checkbox
      :data="tree"
      :default-checked-keys="defaultExpandedKeys.level2"
      :default-expanded-keys="defaultExpandedKeys.level1"
      :props="defaultProps"
      node-key="name"
      @check-change="onCheck"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onTree"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 添加或者编辑角色 -->
  <el-dialog
    :title="roleForm.id ? '编辑角色' : '添加角色'"
    v-model="roleDisplay"
  >
    <div class="role">
      <el-form
        ref="roleRef"
        label-width="80px"
        :inline="false"
        size="default"
        :model="roleForm"
        :rules="roleRules"
      >
        <el-form-item label="角色" prop="role">
          <el-input v-model="roleForm.role"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="describe">
          <el-input v-model="roleForm.describe"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createRole">{{
            roleForm.id ? '确定修改' : '立即创建'
          }}</el-button>
          <el-button @click="roleDisplay = false">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
  <!-- 分页功能 -->

  <el-pagination
    v-model:current-page="page"
    v-model:page-size="pageSize"
    :page-sizes="[3, 5, 10]"
    layout="prev, pager, next, jumper,->,sizes,total"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<style lang="scss" scoped>
.el-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  padding: 5px;
}
.role {
  display: flex;
  justify-content: center;
}
</style>
