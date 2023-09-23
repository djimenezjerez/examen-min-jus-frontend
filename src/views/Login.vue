<template>
  <v-container>
    <v-sheet width="300" class="mx-auto pa-5" elevation="5">
      <v-form @submit.prevent>
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
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-0 my-0">
            <v-text-field
              label="Contraseña"
              prepend-icon="mdi-lock"
              variant="outlined"
              density="compact"
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

</script>
