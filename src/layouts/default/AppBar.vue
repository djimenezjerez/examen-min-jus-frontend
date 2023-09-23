<template>
  <v-app-bar flat>
    <v-container>
      <v-row dense justify="end">
        <v-col cols="2">
          <v-btn
            text="Mis películas"
            variant="outlined"
            color="info"
            prepend-icon="mdi-movie"
          ></v-btn>
        </v-col>
        <v-col cols="2" v-if="route.name !== 'Login' && autenticado == false">
          <v-btn
            text="Iniciar Sesión"
            variant="outlined"
            color="info"
            prepend-icon="mdi-account"
            :to="{ name: 'Login' }"
          ></v-btn>
        </v-col>
        <v-col cols="2" v-else>
          <v-btn
            text="Inicio"
            variant="outlined"
            color="info"
            prepend-icon="mdi-home"
            :to="{ name: 'Home' }"
          ></v-btn>
        </v-col>
        <v-col cols="2" v-if="autenticado == true">
          <v-btn
            text="Cerrar sesión"
            variant="outlined"
            color="info"
            prepend-icon="mdi-exit-to-app"
            @click="cerrarSesion"
          ></v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'

const store = useAppStore()
const { logout } = store
const { cargando, token, autenticado } = storeToRefs(store)
const route = useRoute()
const router = useRouter()

const cerrarSesion = async function() {
  try {
    cargando.value = true
    await axios.post(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/logout`, {}, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token.value}`,
      },
    })
    logout()
    router.replace({ name: 'Home' })
  } catch(error) {
    console.log(error)
  } finally {
    cargando.value = false
  }
}

</script>
