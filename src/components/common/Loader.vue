<script setup lang="ts">
import { withDefaults } from 'vue';

interface LoaderProps {
  height?: string;
  width?: string;
}

const props = withDefaults(defineProps<LoaderProps>(), {
  height: '32px',
  width: '32px',
});
</script>

<template>
  <div class="loader" :style="{ height: props.height, width: props.width }"></div>
</template>

<style scoped lang="scss">
.loader {
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #32205f;
  -webkit-animation: spin 1.5s linear infinite; /* Safari */
  animation: spin 1.5s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
