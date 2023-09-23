<template>
  <v-dialog width="500" v-model="modal">
    <v-card v-if="pelicula != {}">
      <v-card-title>
        <div class="text-center">{{ pelicula.Title }}</div>
      </v-card-title>
      <v-img
        :src="pelicula.Poster"
        height="300px"
      ></v-img>
      <v-card-text>
        <v-table density="compact">
          <tbody>
            <tr>
              <th class="text-end">Año</th>
              <td>{{ pelicula.Year }}</td>
            </tr>
            <tr>
              <th class="text-end">Director</th>
              <td>{{ pelicula.Director }}</td>
            </tr>
            <tr>
              <th class="text-end">Actores</th>
              <td>{{ pelicula.Actors }}</td>
            </tr>
            <tr>
              <th class="text-end">Calificación</th>
              <td>
                <v-rating
                  v-model="calificacion"
                  length="5"
                  half-increments
                  readonly
                ></v-rating>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Cerrar"
          variant="outlined"
          color="info"
          block
          @click="modal = false"
          prepend-icon="mdi-close"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'

const emit = defineEmits(['refrescar'])
const store = useAppStore()
const { cargando, token } = storeToRefs(store)

const pelicula = ref({})
const modal = ref(false)
const calificacion = ref(0)

const abrirModal = async function(idPelicula) {
  try {
    cargando.value = true
    calificacion.value = 0
    const response = await axios.get(import.meta.env.VITE_HOST_OMDB, {
      params: {
        apikey: import.meta.env.VITE_TOKEN_OMDB,
        i: idPelicula,
      }
    })
    pelicula.value = response.data
    calificacion.value = parseFloat(pelicula.value.Ratings[0].Value.split('/')[0])/2
    modal.value = true
  } catch(error) {
    modal.value = false
    console.log(error)
  } finally {
    cargando.value = false
  }
}

const agregarPelicula = async function(pelicula) {
  try {
    cargando.value = true
    await axios.post(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/peliculas`, {
      idImdb: pelicula.imdbID,
      titulo: pelicula.Title,
      poster: pelicula.Poster,
    }, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token.value}`,
      },
    })
    cargando.value = false
    return true
  } catch(error) {
    cargando.value = false
    console.log(error)
    return false
  } finally {
    emit('refrescar')
  }
}

const removerPelicula = async function(idPelicula) {
  try {
    cargando.value = true
    await axios.delete(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/peliculas/${idPelicula}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token.value}`,
      },
    })
    cargando.value = false
    return true
  } catch(error) {
    cargando.value = false
    console.log(error)
    return false
  } finally {
    emit('refrescar')
  }
}

defineExpose({
  abrirModal,
  agregarPelicula,
  removerPelicula,
})

</script>
