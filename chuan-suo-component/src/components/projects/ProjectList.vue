<script>
import BaseContainer from '../UI/BaseContainer.vue'
import BaseSearch from '../UI/BaseSearch.vue'
import ProjectItem from './ProjectItem.vue'
import { computed, ref, watch } from 'vue'

export default {
  components: {
    BaseContainer,
    BaseSearch,
    ProjectItem,
  },

  props: ['user'],

  setup(props) {
    const enteredSearchTerm = ref('')
    const activeSearchTerm = ref('')

    const hasProjects = computed(function () {
      return props.user.projects?.length > 0
    })

    watch(enteredSearchTerm, function (newValue) {
      setTimeout(function () {
        if (newValue === enteredSearchTerm.value) {
          activeSearchTerm.value = newValue
        }
      }, 300)
    })

    // 切换不同用户是清空搜索框
    watch(
      () => props.user,
      function () {
        enteredSearchTerm.value = ''
        activeSearchTerm.value = ''
      },
    )

    const searchedProjects = computed(function () {
      if (activeSearchTerm.value) {
        return props.user.projects.filter(project =>
          project.title
            .toLowerCase()
            .includes(activeSearchTerm.value.toLowerCase()),
        )
      }

      return props.user.projects
    })

    return {
      enteredSearchTerm,
      hasProjects,
      searchedProjects,
    }
  },
}
</script>

<template>
  <base-container v-if="user">
    <h2>{{ user.fullName }}</h2>

    <base-search
      v-model.trim="enteredSearchTerm"
      v-if="hasProjects"
    ></base-search>

    <ul v-if="hasProjects">
      <project-item
        v-for="project in searchedProjects"
        :key="project.id"
        :title="project.title"
      >
      </project-item>
    </ul>
    <h3 v-else>No projects found.</h3>
  </base-container>
</template>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
