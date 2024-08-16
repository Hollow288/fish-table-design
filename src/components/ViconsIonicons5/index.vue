<script setup lang="ts">
import * as Ionicons5 from '@vicons/ionicons5';

onMounted(()=>{
  for (const iconName in Ionicons5) {
      const IconComponent = Ionicons5[iconName];
      console.log(`Rendering icon: ${iconName}`);
      // 在这里你可以使用 IconComponent 渲染图标
      // 例如，假设你在 Vue 中使用：
      // <IconComponent />
    }

})
</script>

<template>
  <main class="center-container">
    <div class="icon-grid">
      <div class="icon-item" v-for="(IconComponent, iconName) in Ionicons5" :key="iconName">
        <n-card :title="iconName" style="width: 100%">
          <n-icon size="40" :component="IconComponent" />
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
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 16px;
}

.icon-item {
  text-align: center;
}
</style>

