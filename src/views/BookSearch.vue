<template>
  <main class="px-32 py-8 min-h-screen">
    <h2 class="text-xl font-semibold">Rechercher un livre</h2>
    <form @submit.prevent="fetchBooks" class="ml-8 my-4 flex gap-8">
      <input type="text" class="border-2 px-2 rounded-md" placeholder="Nom de l'ouvrage" v-model="searchInput">
      <button type="submit" :disabled="loaderStore.isLoading" class="bg-black/80 text-white px-4 py-2 rounded-md disabled:opacity-50">Rechercher</button>
    </form>

    <div v-if="books.nbResults" class="mt-16">
      <div class="my-8 w-full flex justify-between text-md px-10">
        <div>
          <p>Recherche en cours : <span class="italic">{{ books.searchInput }}</span></p>
        </div>
        <div>
          {{ books.data.length }} / {{ books.nbResults }} résultats
        </div>
      </div>

      <div class="grid grid-cols-4 gap-x-6 gap-y-8 mt-12">
        <div v-for="book in books.data" :key="book.key" class="border-black/80 border-2 px-6 py-4 rounded-md">
          <h4 class="font-semibold mb-1">{{ book.title }}</h4>

          <!-- Auteur -->
          <div>
            <p v-if="book.author_name">{{ book.author_name[0] }}</p>
            <p v-else class="opacity-50">Auteur anonyme</p>
          </div>

          <!-- Date de parution -->
          <div>
            <p v-if="book.first_publish_year">Publié en {{ book.first_publish_year }}</p>
            <p v-else class="opacity-50">Date de parution non indiquée</p>
          </div>

          <!-- Nombre de pages -->
          <div>
            <p v-if="book.number_of_pages_median">{{ book.number_of_pages_median }} pages</p>
            <p v-else class="opacity-50">Nombre de pages non indiqué</p>
          </div>

          <!-- Note /5 -->
          <div>
            <p v-if="book.ratings_average">{{ Math.round(book.ratings_average * 10)/10 }} / 5</p>
            <p v-else class="opacity-50">Aucune note saisie</p>
          </div>
          
        </div>
      </div>
      <button @click="fetchMoreBooks" v-if="books.data.length" :disabled="books.data.length == books.nbResults">Fetch more</button>
    </div>
    
  </main>
</template>

<script setup lang="ts">
import axios from 'axios'
import {reactive, ref} from 'vue'
import { createToaster } from "@meforma/vue-toaster";
import { useLoaderStore } from '@/stores/loader';

const loaderStore = useLoaderStore()
const toaster = createToaster();

type booksDataType = {
  data:{
    key:string,
    title:string,
    author_name:string[],
    first_publish_year?:number,
    number_of_pages_median?:number,
    ratings_average?:number
  }[],
  nbResults:number,
  nextPageNumber:number,
  searchInput:string
}

const searchInput = ref('')
const books = reactive<booksDataType>({
  data : [],
  nbResults : 0,
  nextPageNumber : 1,
  searchInput:''
})


const fetchBooks = async () => {
  loaderStore.setIsLoading(true)
  try{
    if(searchInput.value.length<5 || searchInput.value.includes('  ')){
      throw new Error("Merci de saisir au moins 5 caractères pour votre recherche (sans double espace).")
    }
    const response = await axios.get(`https://openlibrary.org/search.json?title=${searchInput.value.replace(' ','+')}&page=1`)
    console.log(response)
    books.data = response.data.docs
    books.nbResults = response.data.numFound
    books.searchInput = searchInput.value
    books.nextPageNumber = 2
  }
  catch(e){
    if (e instanceof Error) {
      toaster.error(e.message)
    }
  }
  loaderStore.setIsLoading(false)
}

const fetchMoreBooks = async () => {
  const response = await axios.get(`https://openlibrary.org/search.json?title=${books.searchInput.replace(' ','+')}&page=${books.nextPageNumber}`)
  books.data = books.data.concat(response.data.docs)
  books.nextPageNumber = books.nextPageNumber+1
}


</script>
