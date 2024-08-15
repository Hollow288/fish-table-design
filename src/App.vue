<script setup lang="ts">
</script>

<template>
    <NDialogProvider>
      <NLoadingBarProvider>
        <NNotificationProvider>
          <NMessageProvider>
            <RouterView v-slot="{ Component }">
              <template v-if="Component">
                <Transition
                    name="router"
                    mode="out-in"
                >
                  <component
                      :is="Component"
                      class="text-base"
                  />
                </Transition>
              </template>
            </RouterView>
          </NMessageProvider>
        </NNotificationProvider>
      </NLoadingBarProvider>
    </NDialogProvider>
    <NGlobalStyle/>
</template>

<style scoped lang="scss">
.router-enter-active,
.router-leave-active {
  transition: opacity 0.3s ease;
}
.router-enter-from,
.router-leave-to {
  opacity: 0;
}
</style>
