import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const cargando = ref(false)
  const autenticado = ref(useLocalStorage('autenticado', false))
  const token = ref(useLocalStorage('token', ''))
  const usuario = ref(useLocalStorage('usuario', {
    nombre: '',
    rol: {
      nombre: '',
    },
  }))

  function login(payload) {
    autenticado.value = true
    token.value = payload.token
    usuario.value = payload.usuario
  }

  return {
    cargando,
    autenticado,
    usuario,
    token,
    login
  }
})
