<script setup lang="ts">
import { ref } from 'vue';

const inputRef = ref<HTMLInputElement | null>(null);
</script>

<script lang="ts">
import { Loader } from '@/components/common';

import { CEP_REGEX } from '@/constants';

import { store } from '@/store';

import { viaCEP } from '@/utils';
import { formatCEP } from '@/utils/formatters';

type ViaCEPResponse = IAddress | { erro: 'true'; };

export default {
  components: { Loader },

  data: () => ({
    store,
    loading: false,
    focused: false,
  }),

  methods: {
    async handleInputChange(event: Event) {
      if (!event.target) return;

      const { value } = (<HTMLInputElement>event.target);

      if (value.length >= 10) {
        this.store.cep = {
          value,
          error: true,
        };

        return;
      }

      const formattedCEP = formatCEP(value);

      this.store.cep = {
        value: formattedCEP,
        error: false
      };

      const isValidCEP = formattedCEP.match(CEP_REGEX);

      if (formattedCEP.length === 9 && !isValidCEP) {
        alert('CEP inválido\nConfira os dados inseridos');
      } else if (isValidCEP) {
        this.loading = true;

        await viaCEP
          .get<ViaCEPResponse>(`${formattedCEP.replace(/-/g, '')}/json`)
          .then(({ data }) => {
            if ('erro' in data) {
              this.store.cep = { value: this.store.cep.value, error: true };
              this.store.address = undefined;

              alert('CEP inválido\nConfira os dados inseridos');
            } else {
              store.address = {
                bairro: data.bairro,
                cep: data.cep,
                localidade: data.localidade,
                logradouro: data.logradouro,
                uf: data.uf,
                numero: data.numero,
                complemento: '',
              };
            }
          })
          .catch((error) => {
            console.error(error);

            this.store.cep = { value: this.store.cep.value, error: true };
            alert('CEP inválido\nConfira os dados inseridos');

            this.store.address = undefined;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    handleInputBlur(event: FocusEvent) {
      if (!(<HTMLInputElement>event.target).value) this.focused = false;
    },
  },
};
</script>

<template>
  <div class="cepContainer">
    <div class="inputContainer" @click="inputRef?.focus" :class="{
      containerSuccess: !!store.cep.value && !store.cep.error,
      containerError: store.cep.error,
    }">
      <label for="cepInput" class="cepLabel" :class="{
        labelFocused: focused,
        labelSuccess: !!store.cep.value && !store.cep.error,
        labelError: store.cep.error,
      }">
        Digite seu CEP
      </label>

      <input ref="inputRef" id="cepInput" class="cepInput" name="cep" :value="store.cep.value" @input="handleInputChange" @focus="focused = true" @blur="handleInputBlur" />
    </div>

    <Loader v-if="loading" />
  </div>
</template>

<style scoped lang="scss">
.cepContainer {
  display: flex;
  align-items: center;

  gap: 16px;
}

.inputContainer {
  cursor: text;
  position: relative;
  width: fit-content;
  display: flex;
  padding: 8px;
  border: 2px solid grey;
  border-radius: 4px;

  &.containerSuccess {
    border-color: #4ca56e;
  }

  &.containerError {
    border-color: #b93535;
  }
}

.cepInput {
  background: transparent;
  border: none;
  font-size: 16px;
}

.cepLabel {
  cursor: text;
  font-weight: 500;
  position: absolute;

  padding: 0 2px;
  border-radius: 5px;
  background-color: transparent;

  transition: 0.2s;
  transition-timing-function: ease;
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);

  opacity: 0.7;

  &.labelFocused {
    background-color: white;
    opacity: 1;
    transform: scale(0.8) translateY(-120%) translateX(-12px);
  }

  &.labelSuccess {
    color: #4ca56e;
  }

  &.labelError {
    color: #b93535;
  }
}
</style>
