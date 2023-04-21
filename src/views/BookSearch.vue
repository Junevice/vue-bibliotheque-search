<template>
  <main class="px-32 py-8">
    <h2 class="text-xl font-semibold">Rechercher un livre</h2>
    <form @submit.prevent="fetchBooks" class="ml-8 my-4 flex gap-8">
      <input type="text" class="border-2 px-2 rounded-md" placeholder="Nom de l'ouvrage" v-model="searchInput">
      <button type="submit" class="bg-black/80 text-white px-4 py-2 rounded-md">Rechercher</button>
    </form>

    <div v-if="books.nbResults">
      <div class="my-8 w-full flex justify-between">
        <div>
          <p>Recherche en cours : {{ books.searchInput }}</p>
        </div>
        <div>
          {{ books.data.length }} / {{ books.nbResults }} résultats
        </div>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <div v-for="book in books.data" :key="book.key">
          <h1>{{ book.title }}</h1>

          <h1 v-if="book.author_name">{{ book.author_name[0] }}</h1>
          <h1 v-else>Auteur Anonyme</h1>

          <h1>Publié en {{ book.first_publish_year }}</h1>
          <h1 v-if="book.number_of_pages_median">{{ book.number_of_pages_median }} pages</h1>
          <h1 v-if="book.ratings_average">{{ Math.round(book.ratings_average * 10)/10 }} / 5</h1>
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

const toaster = createToaster({ /* options */ });

type booksDataType = {
  data:{
    key:string,
    title:string,
    author_name:string[],
    first_publish_year:number,
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
}

const fetchMoreBooks = async () => {
  const response = await axios.get(`https://openlibrary.org/search.json?title=${books.searchInput.replace(' ','+')}&page=${books.nextPageNumber}`)
  books.data = books.data.concat(response.data.docs)
  books.nextPageNumber = books.nextPageNumber+1
}


</script>
