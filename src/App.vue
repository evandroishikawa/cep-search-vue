<script setup lang="ts">
import AddressForm from '@/components/AddressForm.vue';
import CEPInput from '@/components/CEPInput.vue';

import '@/styles/global.scss';
</script>

<script lang="ts">
export default {
  components: { CEPInput, AddressForm },
};
</script>

<template>
  <div class="appContainer">
    <h1>Eu sei meu CEP</h1>

    <CEPInput />

    <AddressForm />
  </div>
</template>

<style lang="scss" scoped>
.appContainer {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  >h1 {
    margin-bottom: 32px;
    font-style: italic;
    color: #32205f;
  }
}
</style>
