<template>
  <div :class="`sticky bottom-0 right-[6rem] transition-opacity ${loaderStore.isLoading==true ? 'opacity-100 pointer-events-all' : 'opacity-0 pointer-events-none'}`"><div class="lds-grid absolute right-[6rem] bottom-[4.7rem]"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
</template> 

<script lang="ts" setup>
import { useLoaderStore } from '@/stores/loader';

const loaderStore = useLoaderStore()

</script>

<style scoped>
.lds-grid {
  display: inline-block;
}
.lds-grid div {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #222;
  animation: lds-grid 1.2s linear infinite;
}
.lds-grid div:nth-child(1) {
  top: 5px;
  left: 5px;
  animation-delay: 0s;
}
.lds-grid div:nth-child(2) {
  top: 5px;
  left: 20px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(3) {
  top: 5px;
  left: 35px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(4) {
  top: 20px;
  left: 5px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(5) {
  top: 20px;
  left: 20px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(6) {
  top: 20px;
  left: 35px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(7) {
  top: 35px;
  left: 5px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(8) {
  top: 35px;
  left: 20px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(9) {
  top: 35px;
  left: 35px;
  animation-delay: -1.6s;
}
@keyframes lds-grid {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

</style>