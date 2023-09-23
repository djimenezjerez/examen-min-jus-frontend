<template>
  <v-container class="px-xl-16">
    <div class="text-h6 text-md-h5">
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:title="{ item }">
          {{ item.text }}
        </template>
      </v-breadcrumbs>
    </div>
    <v-row class="py-4" justify="end">
      <v-col cols="12" sm="4" md="3" lg="2">
        <v-btn color="info" prepend-icon="fas fa-plus" flat block :to="{ name: 'UsuariosForm', params: { id: 'nuevo' } }">
          Nuevo
        </v-btn>
      </v-col>
    </v-row>
    <v-table fixed-header hover density="comfortable" class="elevation-3">
      <thead class="grey--text text--darken-2">
        <tr>
          <th width="20%" class="text-center bg-secondary" style="border: 1px solid white; border-width: 0 1px 0 0;">
            Usuario
          </th>
          <th width="35%" class="text-center bg-secondary" style="border: 1px solid white; border-width: 0 1px 0 0;">
            Nombre
          </th>
          <th width="25%" class="text-center bg-secondary" style="border: 1px solid white; border-width: 0 1px 0 0;">
            Rol
          </th>
          <th width="10%" class="text-center bg-secondary" style="min-width: 152px;">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody v-if="paginacion.total > 0">
        <tr v-for="item in items" :key="item.id">
          <td class="text-center">{{ item.usuario }}</td>
          <td class="text-center">{{ [item.nombre, item.apellidoPaterno, item.apellidoMaterno].join(' ') }}</td>
          <td class="text-center">{{ item.rol }}</td>
          <td class="text-center">
            <v-btn
              @click="detalle.abrirModal(item.id)"
              size="x-small"
              icon="mdi-eye"
              color="info"
              class="mx-1"
              variant="tonal"
            ></v-btn>
            <v-btn
              :to="{ name: 'UsuariosForm', params: { id: item.id } }"
              size="x-small"
              icon="mdi-pencil"
              color="warning"
              class="mx-1"
              variant="tonal"
              :disabled="usuario.id == item.id"
            ></v-btn>
            <v-btn
              @click="eliminar(item.id, item.nombre)"
              size="x-small"
              icon="mdi-trash-can"
              color="error"
              class="mx-1"
              variant="tonal"
              :disabled="usuario.id == item.id"
            ></v-btn>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="7" class="text-center">No hay datos para mostrar</td>
        </tr>
      </tbody>
    </v-table>
    <v-row v-if="paginacion.total > 0" class="text-center bg-grey-lighten-5 mt-2" align="center" dense justify="end">
      <v-col cols="12" sm="4" md="2" class="d-none d-sm-inline">
        <v-select
          v-model="paginacion.porPagina"
          density="compact"
          label="ïtems por página"
          :items="paginacion.opciones"
          hide-details
          @update:modelValue="cambiarPagina()"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="8" md="5" lg="4" xl="2">
        <v-pagination
          v-model="paginacion.pagina"
          density="compact"
          :length="paginacion.ultimaPagina"
          :total-visible="5"
          @update:modelValue="getDatos()"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
  <modal-eliminar :modal="modalEliminar" @eliminado="getDatos()" />
  <modal-detalle ref="detalle" />
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import ModalEliminar from '@/components/shared/ModalEliminar.vue'
import ModalDetalle from '@/components/usuarios/Show.vue'
import axios from 'axios'

const store = useAppStore()
const { cargando, token, usuario } = storeToRefs(store)

const breadcrumbs = [
  {
    text: 'Usuarios',
    to: { name: 'UsuariosIndex' },
    disabled: false,
  },
]
const detalle = ref()
const paginacion = ref({
  pagina: 1,
  ultimaPagina: 0,
  total: 0,
  porPagina: 8,
  opciones: [8, 15, 30],
})
const items = ref([])

const modalEliminar = reactive({
  id: null,
  url: 'usuarios',
  titulo: 'el usuario',
  codigo: null,
  abrir: false,
})

const buscar = function(value) {
  paginacion.value.pagina = 1
  getDatos(value)
}

const eliminar = function(id, nombre) {
  modalEliminar.id = id
  modalEliminar.codigo = nombre
  modalEliminar.abrir = true
}

const cambiarPagina = function() {
  paginacion.value.pagina = 1
  getDatos()
}

const getDatos = async function(buscar = '') {
  try {
    cargando.value = true
    const response = await axios.get(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/usuarios`, {
      params: {
        pagina: paginacion.value.pagina,
        porPagina: paginacion.value.porPagina,
        buscar: buscar,
      },
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token.value}`,
      },
    })
    items.value = response.data.payload.data
    paginacion.value.ultimaPagina = response.data.payload.meta.last_page
    paginacion.value.total = response.data.payload.meta.total
  } catch(error) {
    console.log(error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  getDatos()
})

</script>
