<template>
  <v-container>
    <v-sheet width="300" class="mx-auto pa-5" elevation="5">
      <v-form @submit.prevent="onSubmit">
        <v-row dense>
          <v-col cols="12">
            <div class="text-center">Login</div>
          </v-col>
          <v-col cols="12" class="pb-0 mb-0">
            <v-text-field
              label="Usuario"
              prepend-icon="mdi-account"
              variant="outlined"
              density="compact"
              v-model="form.usuario"
              :error="errores.usuario.length > 0"
              :error-messages="errores.usuario.length ? errores.usuario[0] : ''"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-0 my-0">
            <v-text-field
              label="Contraseña"
              prepend-icon="mdi-lock"
              variant="outlined"
              type="password"
              density="compact"
              v-model="form.password"
              :error="errores.password.length > 0"
              :error-messages="errores.password.length ? errores.password[0] : ''"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn
              text="Ingresar"
              variant="outlined"
              color="info"
              prepend-icon="mdi-send"
              block
              type="submit"
            ></v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'

const router = useRouter()
const store = useAppStore()
const { cargando, token } = storeToRefs(store)
const { login } = store

const errores = ref({
  usuario: [],
  password: [],
})
const form = ref({
  usuario: null,
  password: null,
})

const onSubmit = async function() {
  try {
    cargando.value = true
    Object.keys(errores.value).forEach((key) => {
      errores.value[key] = []
    })
    const response = await axios.post(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/login`, form.value, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    login(response.data.payload)
    if (response.data.payload.usuario.rol === 'ADMINISTRADOR') {
      router.replace({ name: 'UsuariosIndex' })
    } else {
      router.replace({ name: 'Home' })
    }
  } catch(error) {
    form.value.password = null
    Object.keys(error.response.data.errors).forEach((key) => {
      errores.value[key] = error.response.data.errors[key]
    })
  } finally {
    cargando.value = false
  }
}
</script>
