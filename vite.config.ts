import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import os from 'os'
// 获取本地ip
function getNetworkIp() {
  let needHost = ''
  try {
    const network = os.networkInterfaces()
    for (const dev in network) {
      const iface = network[dev]
      if (iface) {
        // 添加这个条件检查，确保iface有被定义
        for (let i = 0; i < iface.length; i++) {
          const alias = iface[i]
          if (
            alias.family === 'IPv4' &&
            alias.address !== '127.0.0.1' &&
            !alias.internal
          ) {
            needHost = alias.address
          }
        }
      }
    }
  } catch (e) {
    needHost = 'localhost'
  }
  return needHost
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0'
  },
  define: {
    'import.meta.env.BASE_IP': JSON.stringify(
      // eslint-disable-next-line no-undef
      `http://${getNetworkIp()}:3030`
    )
  }
})
