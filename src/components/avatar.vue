<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'editAvatar'
})
const prop = defineProps<{
  avatar: string
  name: string
}>()

const user = ref({
  updateAvatar: prop.avatar,
  name: prop.name
})

const onUpdateAvatar = (file: { file: any }) => {
  //option.file就是头像文件
  const uploadFile = file.file
  /* 验证头像格式和大小 */
  if (['image/png', 'image/jpeg'].indexOf(uploadFile.type) === -1) {
    return ElMessage.error('仅支持jpg/jpeg/png格式')
  } else if (uploadFile.size / 1024 / 1024 > 2) {
    return ElMessage.error('头像文件大小不能超过2MB')
  }
  /* 开始上传 */
  const fileReader = new FileReader()
  fileReader.readAsDataURL(uploadFile)
  fileReader.onload = (e) => {
    user.value.updateAvatar = e.target?.result as string
  }
}
const submit = () => {
  emit('updateUserInfo', user.value)
}
const emit = defineEmits(['updateUserInfo'])
</script>
<template>
  <div>
    <div class="avatar-upload">
      <el-form label-position="top">
        <el-form-item label="用户头像">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="onUpdateAvatar"
          >
            <el-avatar :size="80" :src="user.updateAvatar" title="上传头像" />
          </el-upload>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar-upload {
  display: flex;
  align-items: center;
  div {
    margin-left: 10px;
  }
  .el-form-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
