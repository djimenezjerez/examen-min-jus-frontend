<template>
  <v-app>
    <default-bar />
    <default-view />
    <v-overlay
      :model-value="loading"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script setup>
import DefaultBar from './AppBar.vue'
import DefaultView from './View.vue'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'

const useApp = useAppStore()
const { loading } = storeToRefs(useApp)

</script>
