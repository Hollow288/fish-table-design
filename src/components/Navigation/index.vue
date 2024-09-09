<script setup lang="ts">
</script>

<template>
  <main class="center-container">
    <img
        src="../../../public/icon.svg"
        alt="Description of SVG"
        width="100"
        height="100"
        class="zoom-image"
    />
  </main>
</template>

<style scoped>
.center-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 使 main 元素占满视口高度 */
}

.zoom-image {
  transition: transform 0.3s ease; /* 平滑过渡效果 */
}

.zoom-image:hover {
  transform: scale(1.3); /* 鼠标悬停时放大 10% */
}
</style>
