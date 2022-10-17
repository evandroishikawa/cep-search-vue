<script lang="ts">
import { ValidationError } from 'yup';

import { store } from '@/store';

import { getErrorMessages, getFormData } from '@/utils';
import { addressToText } from '@/utils/formatters';

import { addressSchema } from '@/validations';

export default {
  data() {
    return {
      store,
      copied: false,
    };
  },

  methods: {
    async handleSubmit() {
      try {
        const data = getFormData<IAddress>(this.$refs);

        await addressSchema.validate(data, { abortEarly: false });

        this.store.address = data;

        const textAddress = addressToText(data);

        navigator.clipboard.writeText(textAddress);

        this.copied = true;

        alert('Endereço copiado!\n' + textAddress);
      } catch (error) {
        if (error instanceof ValidationError) {
          const messages = getErrorMessages(error);

          alert('Confira os dados inseridos\n' + messages.join('\n'));
        }
      }
    },

    handleReset() {
      this.store.address = undefined;
      this.store.cep = {
        value: '',
        error: false,
      };
      this.copied = false;
    },
  },
};
</script>

<template>
  <form class="form" id="address-form" @submit.prevent="handleSubmit" @reset.prevent="handleReset">
    <div class="inputs">
      <input ref="logradouro" :disabled="!store.address || !!store.address.logradouro" placeholder="Logradouro" name="logradouro" :value="store.address?.logradouro" class="item">

      <input ref="numero" :disabled="!store.address" placeholder="Número" name="numero" :value="store.address?.numero">

      <input ref="complemento" :disabled="!store.address" placeholder="Complemento" name="complemento" :value="store.address?.complemento">

      <input ref="bairro" :disabled="!store.address || !!store.address.bairro" placeholder="Bairro" name="bairro" :value="store.address?.bairro">

      <input ref="localidade" :disabled="!store.address || !!store.address.localidade" placeholder="Cidade" name="localidade" :value="store.address?.localidade">

      <input ref="uf" :disabled="!store.address || !!store.address.uf" placeholder="Estado" name="uf" :value="store.address?.uf">

      <input ref="cep" class="hidden" placeholder="CEP" name="cep" :value="store.address?.cep">
    </div>

    <div class="buttonsContainer">
      <button class="buttonContainer tertiary resetButton" form="address-form" type="reset">
        <i class="material-icons">delete</i>

        Recomeçar
      </button>

      <button class="buttonContainer primary" form="address-form" type="submit">
        Copiar para compartilhar
      </button>

      <div v-if="copied" class="copiedMessage">
        <i class="material-icons">assignment_turned_in</i>

        <p>Endereço copiado!</p>
      </div>

      <i v-else class="material-icons">content_paste</i>
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

  input {
    cursor: text;
    position: relative;
    width: fit-content, -moz-fit-content;
    display: flex;
    padding: 8px;
    border: 2px solid grey;
    border-radius: 4px;

    &:disabled {
      background: #95959560;
    }

    &.hidden {
      display: none;
    }
  }
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

.copiedMessage {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
