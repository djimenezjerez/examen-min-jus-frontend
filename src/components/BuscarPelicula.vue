<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-text-field
          label="Buscar por título"
          variant="outlined"
          prepend-icon="mdi-magnify"
          v-model="buscarTexto"
          @keydown.esc="buscarTexto = ''"
          hide-details
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" v-show="total == 0">
      <v-col cols="12" class="text-center">No se encontraron resultados</v-col>
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
            :src="pelicula.Poster"
            height="300px"
          ></v-img>
          <v-card-title class="text-center">
            {{ pelicula.Title }}
          </v-card-title>
          <v-card-actions>
            <v-btn
              color="orange"
              variant="text"
              class="mx-auto"
              text="Ver Más"
              @click="modalDetalle.abrirModal(pelicula.imdbID)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" v-show="total > 0">
      <v-col cols="12" class="text-center">
        <v-pagination
          v-model="pagina"
          :length="Math.ceil(total/10)"
          @update:model-value="getOmdbData"
        ></v-pagination>
      </v-col>
    </v-row>
    <detalle-pelicula ref="modalDetalle"></detalle-pelicula>
  </v-container>
</template>

<script setup>
import debounce from 'lodash.debounce'
import { ref, watch } from 'vue'
import axios from 'axios'
import DetallePelicula from '@/components/DetallePelicula.vue'

const modalDetalle = ref()
const buscarTexto = ref('')
const peliculas = ref([])
const pagina = ref(1)
const total = ref(0)

watch(buscarTexto, debounce(() => {
  total.value = 0
  pagina.value = 1
  if (buscarTexto.value.length >= 3) {
    getOmdbData()
  } else {
    peliculas.value = []
  }
}, 300))

const getOmdbData = async function() {
  try {
    const res = await axios.get(import.meta.env.VITE_HOST_OMDB, {
      params: {
        apikey: import.meta.env.VITE_TOKEN_OMDB,
        s: buscarTexto.value,
        page: pagina.value,
      }
    })
    if (res.data.Response === 'True') {
      total.value = res.data.totalResults
      peliculas.value = res.data.Search
    } else {
      total.value = 0
      peliculas.value = []
    }
  } catch {
    total.value = 0
    peliculas.value = []
  }
}

</script>