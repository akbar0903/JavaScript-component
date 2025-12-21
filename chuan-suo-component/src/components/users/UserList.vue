<script>
import BaseContainer from '../UI/BaseContainer.vue'
import BaseSearch from '../UI/BaseSearch.vue'
import UserItem from './UserItem.vue'
import { ref, computed } from 'vue'

export default {
  components: {
    BaseContainer,
    BaseSearch,
    UserItem,
  },

  props: ['users'],
  emits: ['select-user'],

  setup(props, context) {
    const enteredSearchTerm = ref('')
    const activeSearchTerm = ref('')
    const sorting = ref('')

    const sort = function (order) {
      sorting.value = order
    }

    const searchTedUsers = computed(function () {
      let users = [...props.users]
      if (enteredSearchTerm.value) {
        users = users.filter(user =>
          user.fullName
            .toLowerCase()
            .includes(enteredSearchTerm.value.toLowerCase()),
        )
      }

      return users
    })

    const displayedUsers = computed(function () {
      if (!sorting.value) return searchTedUsers.value

      return searchTedUsers.value.sort(function (user1, user2) {
        if (sorting.value === 'asc')
          return user1.fullName > user2.fullName ? 1 : -1
        else return user1.fullName < user2.fullName ? 1 : -1
      })
    })

    return {
      enteredSearchTerm,
      activeSearchTerm,
      displayedUsers,
      sorting,
      sort,
      searchTedUsers,
    }
  },
}
</script>

<template>
  <base-container>
    <h2>Active Users</h2>
    <base-search v-model.trim="enteredSearchTerm"></base-search>

    <div>
      <button @click="sort('asc')" :class="{ selected: sorting === 'asc' }">
        Sort Ascending
      </button>
      <button @click="sort('desc')" :class="{ selected: sorting === 'desc' }">
        Sort Descending
      </button>
    </div>

    <ul>
      <user-item
        v-for="user in displayedUsers"
        :key="user.id"
        :id="user.id"
        :username="user.fullName"
        @list-projects="$emit('select-user', $event)"
      ></user-item>
    </ul>
  </base-container>
</template>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
