<script>
export default {
  props: ['id', 'username'],
  emits: ['list-projects'],

  setup(props, context) {
    const listProjects = function () {
      context.emit('list-projects', props.id)
    }

    return {
      listProjects,
    }
  },
}
</script>

<template>
  <li>
    <h3>{{ username }}</h3>
    <button @click="listProjects">View Projects</button>
  </li>
</template>

<style scoped>
li {
	margin: 0.5rem 0;
	padding: 1rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.26);
	border: 1px solid #ccc;
}

li h3 {
	margin: 0;
}
</style>