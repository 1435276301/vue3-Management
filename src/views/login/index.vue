<script setup lang="ts">
import { loginAPI } from '@/api/login'
import { Avatar, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useUserStore } from '@/stores/login'
const userStore = useUserStore()
const login = ref({
  username: '',
  password: ''
})
const loading = ref(false)
const goLogin = async () => {
  loading.value = true
  const res = await loginAPI(login.value)
  if (res.code === 400) {
    ElMessage.error(res.msg)
  } else {
    userStore.getUserInfo(res.data)
    ElMessage.success(res.msg)
    setTimeout(() => {
      router.replace('/')
    }, 500)
  }
  loading.value = false
}
</script>
<template>
  <div class="login">
    <!-- 左侧图片 -->
    <div class="image"></div>
    <!-- 右侧登录页 -->
    <div class="item">
      <div class="item-div">
        <div class="div-image">
          <img src="../../assets/logo.png" alt="" />
          <span>万财保平台</span>
        </div>
        <div class="div">
          <el-form>
            <el-form-item>
              <template #label>
                <div class="div">
                  <el-icon><Avatar /></el-icon>
                  <input
                    type="text"
                    placeholder="请输入手机号码/账号"
                    v-model="login.username"
                  />
                </div>
              </template>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div class="div">
                  <el-icon><Lock /></el-icon>
                  <input
                    @keydown.enter="goLogin"
                    type="password"
                    placeholder="请输入密码"
                    v-model="login.password"
                  />
                </div>
              </template>
            </el-form-item>
            <el-form-item>
              <div class="btn">
                <el-button
                  type="primary"
                  size="default"
                  @click="goLogin"
                  :disabled="login.username && !login.password"
                  :loading="loading"
                  >立即登录</el-button
                >
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  margin: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  .image {
    flex: 1;
    background: url('../../assets/img_dengl.jpg') no-repeat;
    background-size: cover;
  }
  .item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    .item-div {
      width: 20vw;
      height: 50vh;
      border-radius: 5px;
      border: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .div-image {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px;
        img {
          width: 50px;
          height: 50px;
        }
      }
      .div {
        .div {
          border-radius: 5px;
          padding: 0 10px;
          border: 1px solid #ccc;
          input {
            margin-left: 10px;
            outline: none;
            border: 0;
          }
        }
        .btn {
          margin: auto;
          width: 100%;
          button {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
