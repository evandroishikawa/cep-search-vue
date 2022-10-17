<script lang="ts">
import { Input } from '@/components/common';

import { store } from '@/store';

export default {
  components: { Input },

  data() {
    return {
      address: store.address,
    };
  },
};
</script>

<template>
  <form class="form" id="address-form">
    <div class="inputs">
      <Input name="logradouro" label="Logradouro" fixed :disabled="!address" :value="address?.logradouro" class="item" />
    </div>
  </form>
</template>

<style scoped lang="scss">
.form {
  margin-top: 40px;

  display: flex;
  flex-direction: column;

  gap: 24px 0;

  width: 50%;
}

.inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.buttonsContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  width: fit-content;

  >svg {
    height: 24px;
    width: 24px;
    color: #32205f;
  }
}

.item {
  flex: 1;
}

.resetButton {
  gap: 8px;
}
</style>
