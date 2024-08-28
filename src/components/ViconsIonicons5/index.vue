<script setup lang="ts">
import * as Ionicons5 from '@vicons/ionicons5';
import {NotificationType, useMessage, useNotification} from "naive-ui";

const message = useMessage()
const notification = useNotification()


onMounted(()=>{
  notify('info')
})

const copyImport = (iconName:String)=>{
  let resultImport = `import ${iconName} from '@vicons/ionicons5/${iconName}'`;

  navigator.clipboard.writeText(resultImport).then(() => {
    message.success('已复制到粘贴板');
  }).catch(err => {
    message.error('复制失败: ' + err);
  });
}


const notify = (type: NotificationType)=> {
  notification[type]({
    content: 'Ionicons5 图标',
    meta: '右下角复制',
    duration: 1500,
    keepAliveOnHover: true
  })
}

</script>

<template>
  <main class="center-container">
    <div class="icon-grid">
      <div class="icon-item" v-for="(IconComponent, iconName) in Ionicons5" :key="iconName">
        <n-card :title="iconName" style="width: 100%" size="small">
          <n-icon size="40" :component="IconComponent" />
          <div class="copy-text" @click="copyImport(iconName)">Copy Import</div>
        </n-card>
      </div>
    </div>
  </main>
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
}

.center-container {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow-y: auto;
  background-color: #f0f0f0;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding: 16px;
}

.icon-item {
  text-align: center;
}

.copy-text {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 12px;
  color: #333;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.n-card:hover .copy-text {
  opacity: 1;
}

</style>

