import { ref } from 'vue'
import { defineStore } from 'pinia'



export const useLoaderStore = defineStore('loader', () => {
  
  const isLoading = ref(false)

  const setIsLoading = (bool:boolean) => {
    isLoading.value=bool
  }

  return { isLoading, setIsLoading }
})
