<template>
  <div class="home">
    <Room />
  </div>
</template>

<script>
// @ is an alias to /src
import Room from '@/components/Room.vue'

export default {
  name: 'Home',
  components: {
    Room 
  }
}
</script>
