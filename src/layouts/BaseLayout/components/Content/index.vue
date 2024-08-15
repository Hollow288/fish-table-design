<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";


const windowHeight = ref(window.innerHeight)


const updateWindowHeight = () => {
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', updateWindowHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowHeight)
})

</script>

<template>
  <RouterView v-slot="{ Component }">
<!--    <Transition-->
<!--        name="slide-fade"-->
<!--        mode="in-out"-->
<!--    >-->
      <component
          :is="Component"
          :key="Component"
          :style="{ height: `${windowHeight - 30}px` }"
      />
<!--    </Transition>-->
  </RouterView>
</template>

<style scoped lang="scss">
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.3s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
}

</style>