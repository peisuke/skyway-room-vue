<template>
  <v-app>
    <v-content>
      <Room />
    </v-content>
  </v-app>
</template>

<script>
import Room from './components/Room';

export default {
  name: 'App',

  components: {
    Room,
  },

  data: () => ({
    //
  }),
};
</script>
