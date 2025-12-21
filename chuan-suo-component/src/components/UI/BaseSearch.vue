<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],

  setup(_, context) {
    const search = function (event) {
      context.emit('update:modelValue', event.target.value)
    }

    return {
      search,
    }
  },
}
</script>

<template>
  <form action="#">
    <input
      type="search"
      placeholder="Filter items"
      :value="modelValue"
      @input="search"
    />
  </form>
</template>

<style scoped>
input {
  font: inherit;
  width: 100%;
  display: block;
  padding: 0.15rem;
  border: 1px solid #ccc;
}

input:focus {
  outline: none;
  border-color: #00006b;
  background-color: #eeeeff;
}
</style>
