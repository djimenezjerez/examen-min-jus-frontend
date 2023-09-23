<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-text-field
          label="Buscar por título"
          variant="outlined"
          density="compact"
          prepend-icon="mdi-magnify"
          v-model="buscarTexto"
          @keydown.esc="buscarTexto = ''"
          hide-details
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" v-show="total == 0">
      <v-col cols="12" class="text-center">Sin resultados</v-col>
    </v-row>
    <v-row justify="center" v-show="total > 0">
      <v-col
        cols="12"
        sm="4"
        md="4"
        lg="3"
        xl="2"
        v-for="pelicula in peliculas"
        :key="pelicula.imdbID"
      >
        <v-card
          class="mx-auto"
          max-width="344"
          elevation="4"
        >
          <v-img
            :lazy-src="noImage"
            :src="pelicula.Poster"
            height="300px"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="grey-lighten-4"
                  indeterminate
                ></v-progress-circular>
              </div>
            </template>
          </v-img>
          <v-card-title class="text-center">
            {{ pelicula.Title }}
          </v-card-title>
          <v-card-actions>
            <v-row>
              <v-col cols="12" class="mt-2 mb-1 py-0">
                <v-btn
                  color="orange"
                  variant="outlined"
                  class="mx-auto"
                  text="Ver Más"
                  @click="modalDetalle.abrirModal(pelicula.imdbID)"
                  prepend-icon="mdi-eye"
                  block
                ></v-btn>
              </v-col>
              <v-col cols="12" class="mb-2 py-0" v-show="props.omdb">
                <v-btn
                  color="info"
                  variant="outlined"
                  class="mx-auto"
                  text="Añadir a mis películaas"
                  @click="modalDetalle.agregarPelicula(pelicula)"
                  v-show="autenticado"
                  prepend-icon="mdi-plus"
                  block
                ></v-btn>
              </v-col>
              <v-col cols="12" class="mb-2 py-0" v-show="!props.omdb">
                <v-btn
                  color="error"
                  variant="outlined"
                  class="mx-auto"
                  text="Remover"
                  @click="modalDetalle.removerPelicula(pelicula.id)"
                  v-show="autenticado"
                  prepend-icon="mdi-minus"
                  block
                ></v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" v-show="total > 0">
      <v-col cols="12" class="text-center">
        <v-pagination
          v-model="pagina"
          density="compact"
          :length="Math.ceil(total/10)"
          :total-visible="5"
          @update:model-value="getDatos()"
        ></v-pagination>
      </v-col>
    </v-row>
    <detalle-pelicula ref="modalDetalle" @refrescar="getDatos()"></detalle-pelicula>
  </v-container>
</template>

<script setup>
import debounce from 'lodash.debounce'
import { ref, watch } from 'vue'
import axios from 'axios'
import DetallePelicula from '@/components/DetallePelicula.vue'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import noImage from '@/assets/no-image.png'
import { nextTick } from 'vue'

const props = defineProps({
  omdb: { type: Boolean, required: true },
})

const store = useAppStore()
const { cargando, autenticado, token } = storeToRefs(store)

const modalDetalle = ref()
const buscarTexto = ref('')
const peliculas = ref([])
const pagina = ref(1)
const total = ref(0)

watch(buscarTexto, debounce(() => {
  total.value = 0
  pagina.value = 1
  if (buscarTexto.value == '' && props.omdb) {
    getDatos()
  } else {
    if (buscarTexto.value != null) {
      if (buscarTexto.value.length >= 3) {
        getDatos()
      } else {
        peliculas.value = []
      }
    } else {
      resetComponent()
    }
  }
}, 300))

watch(() => props.omdb, () => {
  resetComponent()
})

const getDatos = async function() {
  try {
    cargando.value = true
    let response
    if (props.omdb) {
      response = await axios.get(import.meta.env.VITE_HOST_OMDB, {
        params: {
          apikey: import.meta.env.VITE_TOKEN_OMDB,
          s: buscarTexto.value,
          page: pagina.value,
        },
      })
      if (response.data.Response === 'True') {
        total.value = response.data.totalResults
        peliculas.value = response.data.Search
      } else {
        total.value = 0
        peliculas.value = []
      }
    } else {
      response = await axios.get(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/peliculas`, {
        params: {
          buscar: buscarTexto.value,
          pagina: pagina.value,
        },
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${token.value}`,
        },
      })
      total.value = response.data.payload.meta.total
      peliculas.value = response.data.payload.data
    }
  } catch {
    total.value = 0
    peliculas.value = []
  } finally {
    cargando.value = false
  }
}

const resetComponent = function() {
  nextTick(() => {
    buscarTexto.value = ''
    peliculas.value = []
    pagina.value = 1
    total.value = 0
    nextTick(() => {
      getDatos()
    })
  })
}

</script>
