<template>
  <v-container class="px-xl-16">
    <div class="text-h6 text-md-h5">
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:title="{ item }">
          {{ item.text }}
        </template>
      </v-breadcrumbs>
    </div>
    <v-form @submit.prevent="enviarFormulario">
      <v-row>
        <v-col cols="12">
          <v-card elevation="3">
            <v-card-title>
              Datos del usuario
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="4" class="pb-0">
                  <v-text-field
                    density="compact"
                    v-model="form.usuario"
                    label="Usuario"
                    variant="outlined"
                    :error="errores.usuario.length > 0"
                    :error-messages="errores.usuario.length ? errores.usuario[0] : ''"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" class="pb-0">
                  <v-text-field
                    density="compact"
                    v-model="form.password"
                    label="Contraseña"
                    variant="outlined"
                    type="password"
                    :error="errores.password.length > 0"
                    :error-messages="errores.password.length ? errores.password[0] : ''"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" class="pb-0">
                  <v-select
                    density="compact"
                    v-model="form.rolId"
                    label="Rol"
                    variant="outlined"
                    :error="errores.rolId.length > 0"
                    :error-messages="errores.rolId.length ? errores.rolId[0] : ''"
                    :items="roles"
                    item-title="nombre"
                    item-value="id"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card elevation="3">
            <v-card-title>
              Datos personales
            </v-card-title>
            <v-card-text>
              <v-row justify="end">
                <v-col cols="12" md="4" class="pb-0">
                  <v-text-field
                    density="compact"
                    v-model="form.nombre"
                    label="Nombre"
                    variant="outlined"
                    :error="errores.nombre.length > 0"
                    :error-messages="errores.nombre.length ? errores.nombre[0] : ''"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" class="pb-0">
                  <v-text-field
                    density="compact"
                    v-model="form.apellidoPaterno"
                    label="Apellido Paterno"
                    variant="outlined"
                    :error="errores.apellidoPaterno.length > 0"
                    :error-messages="errores.apellidoPaterno.length ? errores.apellidoPaterno[0] : ''"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" class="pb-0">
                  <v-text-field
                    density="compact"
                    v-model="form.apellidoMaterno"
                    label="Apellido Materno"
                    variant="outlined"
                    :error="errores.apellidoMaterno.length > 0"
                    :error-messages="errores.apellidoMaterno.length ? errores.apellidoMaterno[0] : ''"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-btn
                    type="submit"
                    color="success"
                    prepend-icon="fas fa-check"
                    block
                  >Enviar</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const store = useAppStore()
const { cargando, token } = storeToRefs(store)

const breadcrumbs = [
  {
    text: 'Usuarios',
    to: { name: 'UsuariosIndex' },
    disabled: false,
  }, {
    text: route.params.id != 'nuevo' ? 'Editar' : 'Nuevo',
    to: { name: 'UsuariosForm', params: { id: route.params.id } },
    disabled: false,
  },
]

const errores = ref({
  usuario: [],
  password: [],
  rolId: [],
  nombre: [],
  apellidoPaterno: [],
  apellidoMaterno: [],
})
const form = ref({
  id: null,
  usuario: null,
  password: null,
  rolId: null,
  nombre: null,
  apellidoPaterno: null,
  apellidoMaterno: null,
})
const roles = ref([])

const enviarFormulario = async function() {
  try {
    cargando.value = true
    Object.keys(errores.value).forEach((key) => {
      errores.value[key] = []
    })
    let response
    if (form.value.id > 0) {
      response = await axios.put(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/usuarios/${form.value.id}`, form.value, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${token.value}`,
        },
      })
    } else {
      response = await axios.post(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/usuarios`, form.value, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${token.value}`,
        },
      })
    }
    router.push({ name: 'UsuariosIndex' })
  } catch(error) {
    Object.keys(error.response.data.errors).forEach((key) => {
      errores.value[key] = error.response.data.errors[key]
    })
  } finally {
    cargando.value = false
  }
}

const getDatos = async function() {
  try {
    cargando.value = true
    if (parseInt(route.params.id) > 0) {
      const response = await axios.get(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/usuarios/${route.params.id}`, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${token.value}`,
        },
      })
      form.value = response.data.payload
    } else {
      form.value.id = null
    }
  } catch(error) {
    Object.keys(error.response.data.errors).forEach((key) => {
      errores.value[key] = error.response.data.errors[key]
    })
  } finally {
    cargando.value = false
  }
}

const getRoles = async function() {
  try {
    cargando.value = true
    const response = await axios.get(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/roles`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token.value}`,
      },
    })
    roles.value = response.data.payload
  } catch(error) {
    console.log(error)
  } finally {
    getDatos()
  }
}

onMounted(() => {
  getRoles()
})

</script>
