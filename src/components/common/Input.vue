<script setup lang="ts">
import { v4 as uuid } from 'uuid';
import { defineComponent, ref } from 'vue';

interface InputProps {
  name: string;
  disabled?: boolean;
  error?: boolean;
  fixed?: boolean;
  hidden?: boolean;
  label?: string;
  success?: boolean;
}

const id = ref(uuid());
const props = defineProps<InputProps>();
</script>

<script lang="ts">
const inputRef = ref<HTMLInputElement | null>(null);

export default defineComponent({
  data() {
    return {
      focused: false,
    };
  },

  methods: {
    handleContainerClick() {
      if (inputRef.value?.disabled) return;

      this.focused = true;

      inputRef.value?.focus();
    },

    handleInputBlur(event: FocusEvent) {
      if (!(<HTMLInputElement>event.target).value) this.focused = false;
    },
  },

  inheritAttrs: false,
});
</script>

<template>
  <div class="InputContainer inputContainer" @click="handleContainerClick" :class="{
    containerError: props.error,
    containerSuccess: props.success,
    hidden: props.hidden,
    disabled: props.disabled,
  }">
    <label :if="!!props.label" :for="id" class="label" :class="{
      labelError: props.error,
      labelFixed: props.fixed,
      labelFocused: focused,
      labelSuccess: props.success,
    }">
      {{ props.label }}
    </label>

    <input v-bind="$attrs" ref="inputRef" :disabled="props.disabled" class="input" :id="id" @blur="handleInputBlur" />
  </div>
</template>

<style scoped lang="scss">
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

  &.hidden {
    display: none;
  }

  &.disabled {
    background: #95959553;
  }
}

.input {
  background: transparent;
  border: none;
  font-size: 16px;
}

.label {
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

  &.labelFixed {
    background-color: white;
    opacity: 1;
    transform: scale(0.8) translateY(-120%) translateX(-12px);
  }
}
</style>
