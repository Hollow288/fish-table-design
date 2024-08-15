<script setup lang="ts">
import { Content, Footer} from './components'

</script>

<template>

  <main class="h-screen w-full overflow-hidden">
      <div class="flex h-full w-full border-r border-gray-300 dark:border-gray-950">
        <div class="relative h-full flex-1 overflow-y-auto overflow-x-hidden">
          <Content />
          <Footer />
        </div>
      </div>
  </main>
</template>

<style scoped lang="scss">
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
