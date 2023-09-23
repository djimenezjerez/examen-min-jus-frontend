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

const useApp = useAppStore()
const { loading } = storeToRefs(useApp)

const pelicula = ref({})
const modal = ref(false)
const calificacion = ref(0)

const abrirModal = async function(idPelicula) {
  try {
    loading.value = true
    calificacion.value = 0
    const res = await axios.get(import.meta.env.VITE_HOST_OMDB, {
      params: {
        apikey: import.meta.env.VITE_TOKEN_OMDB,
        i: idPelicula,
      }
    })
    pelicula.value = res.data
    calificacion.value = parseFloat(pelicula.value.Ratings[0].Value.split('/')[0])/2
    modal.value = true
  } catch(error) {
    modal.value = false
    console.log(error)
  } finally {
    loading.value = false
  }
}

defineExpose({
  abrirModal
})

</script>
