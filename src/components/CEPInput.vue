<script lang="ts">
import { defineComponent } from 'vue';

import { Input, Loader } from '@/components/common';

import { CEP_REGEX } from '@/constants';

import { store } from '@/store';

import { viaCEP } from '@/utils';
import { formatCEP } from '@/utils/formatters';

type ViaCEPResponse = IAddress | { erro: 'true'; };

export default defineComponent({
  components: { Input, Loader },

  data: () => ({
    cep: store.cep,
    address: store.address,
    loading: false,
  }),

  methods: {
    async handleInputChange(event: Event) {
      if (!event.target) return;

      const { value } = (<HTMLInputElement>event.target);

      if (value.length >= 10) {
        this.cep = {
          value,
          error: true,
        };

        return;
      }

      const formattedCEP = formatCEP(value);

      this.cep = {
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
              this.cep = { value: this.cep.value, error: true };
              this.address = undefined;

              alert('CEP inválido\nConfira os dados inseridos');
            } else {
              this.address = {
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

            this.cep = { value: this.cep.value, error: true };
            alert('CEP inválido\nConfira os dados inseridos');

            this.address = undefined;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
});
</script>

<template>
  <div class="cepContainer">
    <Input name="cep" label="Digite seu CEP" :value="cep.value" :error="cep.error" @input="handleInputChange" fixed />

    <Loader v-if="loading" />
  </div>
</template>

<style scoped lang="scss">
.cepContainer {
  display: flex;
  align-items: center;

  gap: 16px;
}
</style>
