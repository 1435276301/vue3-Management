<script setup lang="ts">
import { addGoodsAPI } from '@/api/goods'
import { ref } from 'vue'
import { Plus, InfoFilled, SuccessFilled } from '@element-plus/icons-vue'
import * as dayjs from 'dayjs'
import { useGoodsStore } from '@/stores/goods'
const goodsStore = useGoodsStore()

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import router from '@/router'
const productCategoryList = ref([])
// 获取商品分类列表
const getProductCategoryList = async () => {
  await goodsStore.getProductCategory()
  productCategoryList.value = goodsStore.state
}

const productData = ref({
  goodsName: '',
  goodsPrice: 0,
  goodsCount: 1,
  goodsImage: '',
  goodsDetail: null,
  goodsCategory: '',
  createTime: ''
})
// 自定义校验规则
const validatorPrice = (rule: any, value: any, callback: any) => {
  if (value < 0) {
    callback(new Error('商品价格不能小于0'))
  } else {
    callback()
  }
}
const validatorCount = (rule: any, value: any, callback: any) => {
  if (value < 1) {
    callback(new Error('商品数量不能小于1'))
  } else {
    callback()
  }
}
// 表单校验
const rulse = ref({
  goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  goodsPrice: [
    { validator: validatorPrice, trigger: 'blur' },
    {
      required: true,
      message: '请输入商品价格',
      trigger: 'blur'
    }
  ],
  goodsCount: [
    { required: true, message: '请输入商品数量', trigger: 'blur' },
    {
      validator: validatorCount
    }
  ],
  goodsImage: [{ required: true, message: '请上传商品图片', trigger: 'blur' }],
  goodsCategory: [
    { required: true, message: '请选择商品分类', trigger: 'blur' }
  ]
})

const dialogVisible = ref(false)
const dialogImageUrl = ref('')
// 点击图片预览大图
const handlePreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
const handleSuccess = async (file) => {
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

const quillEdit = ref(null)
const editableTabsValue = ref('0')
const formRef = ref(null)
const handleTabChange = async (newVal) => {
  if (newVal == 1) {
    await formRef.value.validateField(['goodsName', 'goodsPrice', 'goodsCount'])
    getProductCategoryList()
  }

  if (newVal == 2) await formRef.value.validateField(['goodsCategory'])

  if (newVal == 3) await formRef.value.validateField(['goodsImage'])
  if (newVal == 4) {
    productData.value.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    productData.value.goodsCategory = JSON.stringify(
      productData.value.goodsCategory
    )
    productData.value.goodsDetail = quillEdit.value.getHTML()

    Promise.all([
      await formRef.value.validate(),
      await addGoodsAPI(productData.value)
    ])
  }

  active.value = newVal
}

const back = () => {
  router.replace('/productList')
}
const active = ref(0)
</script>
<template>
  <div>
    <!-- 添加商品信息提示 -->
    <div class="header">
      <div>
        <el-icon><InfoFilled /></el-icon>
        <span>添加商品内容</span>
      </div>
    </div>
    <!-- 步骤条 -->
    <div>
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="商品信息" />
        <el-step title="商品分类" />
        <el-step title="商品图片" />
        <el-step title="商品内容" />
      </el-steps>
    </div>
    <!-- tab栏以及主体 -->
    <div>
      <el-form
        label-position="top"
        :model="productData"
        ref="formRef"
        :rules="rulse"
      >
        <el-tabs
          :before-leave="handleTabChange"
          tab-position="left"
          style="height: auto"
          class="demo-tabs"
          v-model="editableTabsValue"
        >
          <el-tab-pane label="商品信息">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="productData.goodsName"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goodsPrice">
              <el-input
                type="number"
                v-model="productData.goodsPrice"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goodsCount">
              <el-input
                type="number"
                v-model="productData.goodsCount"
              ></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品分类">
            <el-form-item label="商品分类" prop="goodsCategory"
              ><el-cascader
                v-model="productData.goodsCategory"
                :options="productCategoryList"
                :show-all-levels="false"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-form-item label="商品图片" prop="goodsImage">
              <el-upload
                :on-change="handleSuccess"
                :on-preview="handlePreview"
                list-type="picture-card"
                :auto-upload="false"
                accept="image/jpeg,image/png,image/jpg"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <el-form-item prop="goodsDetail">
              <div style="height: 100vh; width: 100vw">
                <QuillEditor theme="snow" ref="quillEdit"></QuillEditor>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="完成">
            <el-result>
              <template #title>
                <el-icon color="#67c23a" size="20px"><SuccessFilled /></el-icon>
              </template>
              <template #icon>
                <el-image
                  :src="productData.goodsImage"
                  style="width: 30%; height: 30%"
                />
              </template>
              <template #sub-title>
                <div>{{ productData.goodsName }}</div>
              </template>
              <template #extra>
                <el-button type="primary" @click="back">返回</el-button>
              </template>
            </el-result>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>

  <!-- 放大缩略图 -->
  <el-dialog v-model="dialogVisible">
    <div style="display: flex; justify-content: center">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.header {
  width: 90vw;
  height: 35px;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f4f5;
  color: #9c9fa4;
  font-size: 14px;
}
</style>
