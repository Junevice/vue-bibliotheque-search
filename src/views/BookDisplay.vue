<script setup lang="ts">
const props = defineProps({
  id:{
    required:true,
    type:String
  }
})
</script>

<template>
  <main>
    <p>Book Display : {{ id }}</p>
  </main>
</template>