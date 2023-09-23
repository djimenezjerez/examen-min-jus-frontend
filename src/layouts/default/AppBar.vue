<template>
  <v-app-bar flat>
    <v-container>
      <v-row dense justify="end">
        <v-col cols="12" sm="6" md="2">
          <v-btn
            text="Iniciar Sesión"
            variant="outlined"
            color="info"
            prepend-icon="mdi-account"
            block
            :to="{ name: 'Login' }"
            v-if="route.name !== 'Login'"
          ></v-btn>
          <v-btn
            text="Inicio"
            variant="outlined"
            color="info"
            prepend-icon="mdi-home"
            block
            :to="{ name: 'Home' }"
            v-else
          ></v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import {useRoute} from 'vue-router'

const route = useRoute()
</script>
