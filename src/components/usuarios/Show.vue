<template>
  <v-dialog
    v-model="abrir"
    persistent
    width="600px"
  >
    <v-card>
      <v-card-title class="bg-blue">
        <v-row justify="space-between" aligh="center" align-content="center" dense>
          <v-col cols="11">Detalle del Usuario</v-col>
          <v-col cols="1" class="text-end">
            <v-btn @click="abrir = false" density="compact" variant="plain" color="white" icon="fas fa-times"></v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-card elevation="3" density="compact">
              <v-card-title>
                Datos del usuario
              </v-card-title>
              <v-card-text>
                <v-table density="compact">
                  <colgroup>
                    <col width="35%">
                    <col width="65%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <th class="text-right pr-2 font-weight-bold">Usuario:</th>
                      <td>{{ registro.usuario }}</td>
                    </tr>
                    <tr>
                      <th class="text-right pr-2 font-weight-bold">Rol:</th>
                      <td>{{ registro.rol }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card elevation="3" density="compact">
              <v-card-title>
                Datos personales
              </v-card-title>
              <v-card-text>
                <v-table density="compact">
                  <colgroup>
                    <col width="35%">
                    <col width="65%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <th class="text-right pr-2 font-weight-bold">Nombre:</th>
                      <td>{{ registro.nombre }}</td>
                    </tr>
                    <tr>
                      <th class="text-right pr-2 font-weight-bold">Apellido Paterno:</th>
                      <td>{{ registro.apellidoPaterno }}</td>
                    </tr>
                    <tr>
                      <th class="text-right pr-2 font-weight-bold">Apellido Materno:</th>
                      <td>{{ registro.apellidoMaterno || '-' }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="info"
          variant="flat"
          @click="abrir = false"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'

const store = useAppStore()
const { cargando, token } = storeToRefs(store)

const abrir = ref(false)
const registro = ref({})

const getDatos = async function(id) {
  try {
    cargando.value = true
    const response = await axios.get(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/usuarios/${id}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token.value}`,
      },
    })
    registro.value = response.data.payload
  } catch(error) {
    alert(error.response.data.message, true)
    abrir.value = false
  } finally {
    cargando.value = false
  }
}

const abrirModal = function(id) {
  abrir.value = true
  nextTick(() => {
    getDatos(id)
  })
}

defineExpose({ abrirModal })

</script>
