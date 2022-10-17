import { reactive } from 'vue';

interface IStore {
  cep: ICEP;
  address: IAddress | undefined;
}

export const store = reactive<IStore>({
  cep: {
    value: '',
    error: false,
  },
  address: undefined,
});
