<template>
  <v-app-bar flat>
    <v-container>
      <v-row dense justify="end">
        <v-col cols="12" sm="4" md="3" lg="2" v-if="route.name !== 'Login' && autenticado === true">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="outlined"
                color="info"
                prepend-icon="mdi-account"
                append-icon="mdi-menu-down-outline"
              >
                {{ usuario.nombre }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item :to="{ name: 'Home' }">
                <v-list-item-title>Inicio</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ name: 'Peliculas' }">
                <v-list-item-title>Mis películas</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ name: 'UsuariosIndex' }" v-show="usuario.rol == 'ADMINISTRADOR'">
                <v-list-item-title>Usuarios</v-list-item-title>
              </v-list-item>
              <v-list-item @click="cerrarSesion">
                <v-list-item-title>Cerrar sesión</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="4" md="3" lg="2" v-if="route.name !== 'Login' && autenticado === false">
          <v-btn
            text="Iniciar Sesión"
            variant="outlined"
            color="info"
            prepend-icon="mdi-account"
            :to="{ name: 'Login' }"
          ></v-btn>
        </v-col>
        <v-col cols="12" sm="4" md="3" lg="2" v-if="route.name === 'Login'">
          <v-btn
            text="Inicio"
            variant="outlined"
            color="info"
            prepend-icon="mdi-home"
            :to="{ name: 'Home' }"
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
const { cargando, token, autenticado, usuario } = storeToRefs(store)
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
