<script setup lang="ts">
import { deleteGoodsAPI, getGoodsListAPI, updateGoodsAPI } from '@/api/goods'
import { Search, Edit, Delete, Plus } from '@element-plus/icons-vue'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGoodsStore } from '@/stores/goods'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { UploadInstance, UploadRawFile } from 'element-plus'
const goodsStore = useGoodsStore()
const router = useRouter()
const route = useRoute()
const goodsList = ref()
// 监听当前的路由
watch(
  () => route.path,
  (val) => {
    if (val === '/productList') {
      addProduct.value = false
      getGoodsList()
    } else {
      addProduct.value = true
    }
  }
)
// 获取商品列表

const getGoodsList = async () => {
  const res = await getGoodsListAPI()
  res.data = res.data.filter((item: any) => {
    if (searchList.value !== '')
      return item.goodsName.includes(searchList.value)
    else return item
  })
  goodsList.value = res.data.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  )
  total.value = res.data.length
}
const total = ref(0)
onMounted(() => {
  if (route.path === '/productList') {
    addProduct.value = false
    getGoodsList()
  } else {
    addProduct.value = true
  }
})

const addProduct = ref(false)
const addGoods = () => {
  router.push({
    path: '/addProduct'
  })
}

const page = ref(1)
const pageSize = ref(10)

const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
  getGoodsList()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getGoodsList()
}

const searchList = ref('')

const deleteTable = async (row: { id: any }) => {
  await ElMessageBox.confirm('确定删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  const res = await deleteGoodsAPI(row.id)
  ElMessage.success(res.msg)
  getGoodsList()
}
const quillEditor = ref(null)
const productCategoryList = ref([])

// 点击编辑按钮回调
const editTable = async (row: {
  goodsCategory: string
  goodsImage: string
}) => {
  await goodsStore.getProductCategory()
  productCategoryList.value = goodsStore.state
  drawer.value = true
  row.goodsCategory =
    typeof row.goodsCategory === 'string'
      ? JSON.parse(row.goodsCategory)
      : row.goodsCategory
  Object.assign(productData.value, row)
  fileList.value[0].url = row.goodsImage
  nextTick(() => {
    quillEditor.value.setHTML(productData.value.goodsDetail || '')
  })
}
const drawer = ref(false)

const productData = ref({
  goodsName: '',
  goodsPrice: '',
  goodsCount: '',
  goodsCategory: '',
  goodsDetail: '',
  goodsImage: ''
})
const fileList = ref([
  {
    url: productData.value.goodsImage
  }
])
const handleSuccess = async (file: { raw: Blob }) => {
  // 限制上传的文件类似是否为图片格式
  if (file.raw.type.indexOf('image') !== -1) {
    const reader = new FileReader()
    reader.readAsDataURL(file.raw)
    reader.onloadend = () => {
      productData.value.goodsImage = reader.result as string
    }
  } else {
    ElMessage.error('请上传图片格式')
  }
}
const dialogVisible = ref(false)
const handlePreview = (row: { url: string }) => {
  dialogVisible.value = true
  dialogImageUrl.value = row.url
}

const dialogImageUrl = ref('')

const onSubmit = async () => {
  console.log(productData.value)
  productData.value.goodsCategory = JSON.stringify(
    productData.value.goodsCategory
  )
  productData.value.goodsDetail = quillEditor.value.getHTML()
  const res = await updateGoodsAPI(productData.value)
  console.log(res)
}

const upload = ref<UploadInstance>()
const handleExceed = (files: UploadRawFile[]) => {
  upload.value.clearFiles()
  upload.value.handleStart(files[0] as UploadRawFile)
}
</script>
<template>
  <div v-if="!addProduct">
    <!-- 搜索框和添加商品 -->
    <div class="search">
      <el-input
        placeholder="请输入商品名称"
        class="input-with-select"
        v-model="searchList"
      >
        <template #append>
          <el-button :icon="Search" @click="getGoodsList" />
        </template>
      </el-input>
      <el-button type="primary" class="btn" @click="addGoods"
        >添加商品</el-button
      >
    </div>
    <!-- 商品列表 -->
    <div class="table">
      <el-table border :data="goodsList">
        <el-table-column prop="id" width="50" type="index" />
        <el-table-column prop="goodsName" label="商品名称" />
        <el-table-column prop="goodsPrice" label="商品价格(元)" />
        <el-table-column prop="goodsCount" label="商品数量" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" align="center">
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

    <!-- 分页 -->
    <div style="margin: 10px">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10]"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <RouterView v-else />

  <!-- 抽屉组件 -->
  <el-drawer v-model="drawer" title="I am the title" :with-header="false">
    <div>
      <el-form ref="form" label-width="80px" :inline="false">
        <el-form-item label="商品名称">
          <el-input v-model="productData.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="productData.goodsPrice"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="productData.goodsCount"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader
            v-model="productData.goodsCategory"
            :options="productCategoryList"
            :show-all-levels="false"
          />
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            ref="upload"
            v-model:file-list="fileList"
            :on-change="handleSuccess"
            :on-preview="handlePreview"
            list-type="picture-card"
            accept="image/jpeg,image/png,image/jpg"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品详情">
          <div style="height: 200px; width: 100vw">
            <QuillEditor theme="snow" ref="quillEditor"></QuillEditor>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="position: fixed; bottom: 10px; right: 10px">
            <el-button @click="drawer = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
  <!-- 放大缩略图 -->
  <el-dialog v-model="dialogVisible">
    <div style="display: flex; justify-content: center">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
.search {
  .input-with-select {
    width: 15%;
  }
  .btn {
    margin-left: 10px;
  }
}
.table {
  margin-top: 10px;
}
</style>
