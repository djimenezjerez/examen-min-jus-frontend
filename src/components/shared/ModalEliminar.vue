<template>
  <v-dialog
    v-model="modal.abrir"
    width="auto"
  >
    <v-card>
      <v-card-title class="text-h6 bg-primary">
        ¿Seguro que desea eliminar el registro?
      </v-card-title>
      <v-card-text>
        Confirme para elminar {{ modal.titulo }} {{ modal.codigo }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          variant="tonal"
          @click="onSubmit"
        >
          SI
        </v-btn>
        <v-btn
          color="error"
          variant="tonal"
          @click="modal.abrir = false"
        >
          NO
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { toRefs } from 'vue'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'

const store = useAppStore()
const { cargando, token } = storeToRefs(store)

const emit = defineEmits(['eliminado'])
const props = defineProps({
  modal: {
    type: Object,
    default: {
      id: null,
      url: null,
      titulo: null,
      codigo: null,
      abrir: false,
    },
  },
})
const { modal } = toRefs(props)

const onSubmit = async function() {
  try {
    cargando.value = true
    await axios.delete(`${import.meta.env.VITE_HOST_BACKEND}/api/v1/${modal.value.url}/${modal.value.id}`, {withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token.value}`,
      },
    })
    modal.value.abrir = false
    emit('eliminado')
  } catch(error) {
    console.log(error)
  } finally {
    cargando.value = false
  }
}

</script>
