<script setup lang="ts">
import {
  addGoodsCategoryAPI,
  deleteGoodsCategoryAPI,
  deleteGoodsCategoryOneAPI,
  getGoodsCategoryAPI
} from '@/api/goods'
import { v4 as uuidv4 } from 'uuid'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
const goodsList = ref([])
// 获取商品分类列表
const getGoodsList = async () => {
  const res = await getGoodsCategoryAPI()
  goodsList.value = res.data
    .map((item: any) => {
      return {
        ...JSON.parse(item.categoryName),
        id: item.id
      }
    })
    .slice(page.value - 1 * pageSize.value, page.value * pageSize.value)

  total.value = res.data.length
}

onMounted(async () => {
  getGoodsList()
})
const drawer = ref(false)
// 添加分类按钮回调
const addCategory = () => {
  level1Name.value = ''
  level2Name.value = ''
  level3Name.value = ''
  categoryList.value.categoryName = ''
  categoryList.value.children = []
  active.value = 0
  drawer.value = true
}
// 删除分类按钮回调 -- 一级分类和子级分类调用不一样的方法
const deleteTable = async (eve: any) => {
  await ElMessageBox.confirm('此操作将永久删除该分类, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  // 一级分类有id
  console.log(eve)

  if (!eve.id) {
    expandList.value.children = expandFn(eve)
    await deleteGoodsCategoryAPI(JSON.stringify(expandList.value))
  } else {
    await deleteGoodsCategoryOneAPI(eve.id)
    getGoodsList()
  }
  ElMessage.success('删除分类成功')
}

// 展开对象的回调函数
const expandChange = (eve: { id: any }) => {
  // 如果展开的是一级对象，则将一级对象赋值给expandList
  if (eve.id) {
    expandList.value = eve
  }
}
const expandList = ref()
// 展开对象的回调函数，筛选出当前对象是否有子级对象，且当前对象的名字不等于 点击删除按钮 传过来的名字，之后将子级对象不等于传过来的对象名字选出来，如果没有子级对象则将当前不等于传过来的名字赋值给父级
const expandFn = (data: { categoryName: any }) => {
  return expandList.value.children.filter((item: any) => {
    return item.children && item.categoryName !== data.categoryName
      ? (item.children = item.children.filter(
          (item: any) => item.categoryName !== data.categoryName
        ))
      : item.categoryName !== data.categoryName
  })
}
const level1Name = ref()
const level2Name = ref()
const level3Name = ref()
const active = ref(0)

const categoryList = ref<any>({
  categoryName: '',
  identification: '',
  children: []
})
const level2List = ref({
  categoryName: '',
  identification: '',
  children: []
})
const level3List = ref({
  categoryName: '',
  identification: ''
})

// 二级分类点击添加的操作
const addLevel2 = () => {
  level2List.value.categoryName = level2Name.value
  // 添加随机id
  level2List.value.identification = uuidv4()
  const item = categoryList.value.children.some(
    (item: any) => item.categoryName === level2Name.value
  )
  if (item) {
    ElMessage.error('二级分类不能重复!')
  } else {
    // 使用深拷贝push对象，否则就全部都是引用，修改一个，全部都会修改
    categoryList.value.children.push(
      JSON.parse(JSON.stringify(level2List.value))
    )
    level2Name.value = ''
  }
}

// 三级分类点击添加的操作
const addLevel3 = () => {
  level3List.value.categoryName = level3Name.value
  level3List.value.identification = uuidv4()
  categoryList.value.children.forEach((item: any) => {
    if (item.categoryName === level2Value.value) {
      const ble = item.children.some(
        (item2: any) => item2.categoryName === level3Name.value
      )
      if (ble) {
        return ElMessage.error('三级分类不能重复!')
      } else {
        ElNotification({
          message: '添加成功',
          type: 'success'
        })
        item.children.push(JSON.parse(JSON.stringify(level3List.value)))
      }
    }
  })
  level3Name.value = ''
}
// 定义是否选了二级分类
const level2Select = ref(false)
// 当选了二级分类后，三级分类才可以填写
const onSelect = () => {
  level2Select.value = true
}

// 点击下一步需要执行的操作
const onActive = () => {
  if (active.value === 0) {
    if (level1Name.value) active.value++
    else ElMessage.error('请添加一级分类')
    categoryList.value.categoryName = level1Name.value
    categoryList.value.identification = uuidv4()
  } else if (active.value === 1 && categoryList.value.children.length > 0) {
    active.value++
  } else {
    ElMessage.error('请添加二级分类至少为1')
  }
}
// 下拉选择绑定
const level2Value = ref('')

// 点击完成回调函数
const addCategoryParams = async () => {
  await addGoodsCategoryAPI(JSON.stringify(categoryList.value))
  active.value++
  getGoodsList()
}

const isLevel3 = ref(false)
const ids = ref('')
// 编辑分类按钮回调
const editTable = (eve: {
  id: any
  children: any
  categoryName: string
  identification: string
}) => {
  categoryName.value = ''
  if (!eve.id && !eve.children) {
    isLevel3.value = true
  } else {
    isLevel3.value = false
  }
  if (eve.id) {
    expandList.value = eve
  }
  addCate.value = eve.categoryName
  ids.value = eve.identification
  editDialog.value = true
}

// 点击编辑组件确定按钮
const sumbit = async () => {
  if (
    expandList.value.categoryName === addCate.value &&
    expandList.value.identification === ids.value
  ) {
    levelList(expandList.value, level2List.value)
  } else if (expandList.value.children) {
    expandList.value.children.forEach((item: any) => {
      if (
        item.categoryName === addCate.value &&
        item.identification === ids.value
      ) {
        levelList(item, level3List.value)
      }
    })
  }
}
// 将所有重复的代码封装成一个函数
const levelList = (
  item: { children: any[] },
  data: { categoryName: string; identification: string }
) => {
  data.categoryName = categoryName.value
  data.identification = uuidv4()
  const repeat = item.children.some(
    (item: any) => item.categoryName === categoryName.value
  )
  if (repeat) ElNotification.warning(categoryName.value + '已存在')
  else {
    item.children.push(JSON.parse(JSON.stringify(data)))
    categoryName.value = ''
    updateCategory()
  }
}

// 点击编辑组件更改按钮
const editName = () => {
  // 调用回调函数
  editFn(expandList.value)
}
const editFn = (data) => {
  // 判断输入的名称是否等于已有的名称
  const repeat = goodsList.value.some(
    (item: any) => item.categoryName === categoryName.value
  )
  // 判断当前的名称是否等于显示的名称且唯一的标识是否相等
  if (
    data.categoryName === addCate.value &&
    data.identification === ids.value
  ) {
    // 如果名称等于已有的名称,则提示用户已存在
    if (repeat) ElNotification.warning(categoryName.value + '已存在')
    else {
      // 否则就将当前的名称等于输入的名称
      data.categoryName = categoryName.value
      updateCategory()
    }
    // 如果当前的的判断为fasle,则看当前的元素是否有子级
  } else if (data.children) {
    // 先判断子级的名称是否等于输入的名称
    const repeat = data.children.some(
      (item: any) => item.categoryName === categoryName.value
    )
    // 遍历子级
    data.children.forEach((item: any) => {
      //  判断子级的的名称是否等于显示的名称且唯一的标识是否相等
      if (
        item.categoryName === addCate.value &&
        item.identification === ids.value
      ) {
        // 如果名称等于已有的名称,则提示用户已存在
        if (repeat) ElNotification.warning(categoryName.value + '已存在')
        // 否则就将当前的名称等于输入的名称
        else {
          item.categoryName = categoryName.value
          updateCategory()
        }
        // 如果都不满足,则判断是否还有子级,然后递归
      } else if (item.children) editFn(item)
    })
  }
}
// 封装发送更改请求函数
const updateCategory = async () => {
  const res = await deleteGoodsCategoryAPI(JSON.stringify(expandList.value))
  ElMessage.success(res.msg)
  editDialog.value = false
}
const editDialog = ref(false)
const addCate = ref('')
const categoryName = ref('')

// 当前页数
const page = ref(1)
// 每页多少条数据
const pageSize = ref(10)
// 每页数据改变回调
const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
  getGoodsList()
}
// 页数改变回调
const handleCurrentChange = (val: number) => {
  page.value = val
  getGoodsList()
}
// 总条数
const total = ref(0)
</script>
<template>
  <div>
    <!-- 添加分类 -->
    <div style="margin: 10px">
      <el-button type="primary" @click="addCategory">添加分类</el-button>
    </div>
    <!-- 分类列表 -->
    <div>
      <el-table
        max-height="70vh"
        border
        :data="goodsList"
        row-key="identification"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="expandChange"
      >
        <el-table-column prop="id" width="50" type="index" />
        <el-table-column prop="categoryName" label="分类名称">
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <!-- eslint-disable-next-line vue/valid-attribute-name -->
          <template #="{ row }">
            <el-button :icon="Edit" type="primary" @click="editTable(row)"
              >编辑</el-button
            >
            <el-button :icon="Delete" type="danger" @click="deleteTable(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 抽屉组件 -->
  <el-dialog v-model="drawer">
    <el-card class="box-card">
      <template #header>
        <div class="card-header" v-if="active !== 3">
          <el-steps :active="active" finish-status="success" simple>
            <el-step title="添加一级分类" />
            <el-step title="添加二级分类" />
            <el-step title="添加三级分类" />
          </el-steps>
        </div>
      </template>
      <div class="text" v-show="active === 0">
        <el-input
          v-model="level1Name"
          maxlength="5"
          placeholder="请输入一级分类"
          show-word-limit
          type="text"
        />
      </div>
      <div v-show="active === 1" class="text">
        <el-input v-model="categoryList.categoryName" disabled></el-input>
        <el-select
          v-if="categoryList.children.length > 0"
          :placeholder="
            categoryList.children[categoryList.children.length - 1].categoryName
          "
        >
          <el-option
            disabled
            v-for="item in categoryList.children"
            :key="item.categoryName"
            :value="item.categoryName"
            >{{ item.categoryName }}</el-option
          >
        </el-select>
        <div class="level2">
          <el-input
            v-model="level2Name"
            maxlength="5"
            placeholder="请输入二级分类"
            show-word-limit
            type="text"
          />
          <el-button
            :icon="Plus"
            type="primary"
            plain
            v-show="level2Name"
            @click="addLevel2"
          ></el-button>
        </div>
      </div>
      <div v-show="active === 2" class="text">
        <el-input v-model="level1Name" disabled></el-input>
        <el-select
          placeholder="请选择二级分类"
          v-model="level2Value"
          @change="onSelect"
        >
          <el-option
            v-for="item in categoryList.children"
            :key="item.categoryName"
            :value="item.categoryName"
            >{{ item.categoryName }}</el-option
          >
        </el-select>
        <div class="level2">
          <el-input
            :disabled="!level2Select"
            v-model="level3Name"
            maxlength="5"
            placeholder="请输入三级分类"
            show-word-limit
            type="text"
          />
          <el-button
            :icon="Plus"
            type="primary"
            plain
            v-show="level3Name"
            @click="addLevel3"
          ></el-button>
        </div>
      </div>

      <!-- 完成后显示结果 -->
      <el-result
        v-if="active === 3"
        icon="success"
        title="成功"
        sub-title="你已成功完成商品分类的添加"
      >
        <template #extra>
          <el-button type="primary" @click="drawer = false">退出</el-button>
        </template>
      </el-result>
    </el-card>
    <div class="btn" v-if="active !== 3">
      <el-button type="primary" v-if="active !== 0" @click="active--">
        上一步
      </el-button>
      <el-button
        v-if="active !== 2"
        type="primary"
        style="float: right"
        @click="onActive"
        >下一步</el-button
      >
      <el-button
        type="primary"
        v-else
        style="float: right"
        :disabled="!level3List.categoryName"
        @click="addCategoryParams"
      >
        完成
      </el-button>
    </div>
  </el-dialog>

  <!-- 编辑分类内容 -->
  <el-dialog v-model="editDialog" title="编辑">
    <div class="edit">
      <el-input v-model="addCate" disabled></el-input>
      <el-input
        placeholder="请添加分类或修改名称"
        v-model="categoryName"
      ></el-input>
      <div class="btn" style="display: flex; justify-content: center">
        <el-button type="primary" @click="sumbit" v-if="!isLevel3"
          >添加分类</el-button
        >
        <el-button type="warning" @click="editName" style="width: 100%"
          >更改名称</el-button
        >
      </div>
    </div>
  </el-dialog>

  <!-- 分页内容 -->
  <div style="margin: 10px">
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 8, 10]"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  .text {
    margin: 0 auto;
    width: 200px;
    .level2 {
      display: flex;
    }
  }
}
.btn {
  margin-top: 10px;
  width: 100%;
  height: 35px;
}
.edit {
  margin: auto;
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>
