<template>
  <main class="px-32 py-8 min-h-screen">
    <h2 class="text-xl font-semibold">Rechercher un livre</h2>
    <form @submit.prevent="fetchBooks" class="ml-8 my-4 flex justify-between">
      <div class="flex gap-8">
        <input type="text" class="border-2 px-2 rounded-md" placeholder="Nom de l'ouvrage" v-model="booksStore.searchBooksInput">
        <button type="submit" :disabled="loaderStore.isLoading" class="bg-black/80 text-white px-4 py-2 rounded-md disabled:opacity-50">Rechercher</button>
      </div>
    
      <div class="flex items-center gap-8" v-if="booksStore.searchedBooks.nbResults">
          <div class="flex flex-col">
            <label>Filtre nombre pages minimum</label>
            <input type="range" min="0" max="1000" step="100" v-model="nbPagesFilter" @change="filterBooks" class="color-black/80">
          </div>
          <span class="opacity-70">{{ nbPagesFilter }} pages</span>
        </div>
    </form>

    <div v-if="booksStore.searchedBooks.nbResults" class="mt-16">
      <div class="my-8 w-full flex justify-between text-md px-10">
        <div>
          <p>Recherche en cours : <span class="italic">{{ booksStore.searchedBooks.searchInput }}</span></p>
        </div>
        <div>
          <span>{{ booksStore.searchedBooks.filteredData.length }} / </span>{{ booksStore.searchedBooks.data.length }} / {{ booksStore.searchedBooks.nbResults }} résultats
        </div>
      </div>

      <div class="grid grid-cols-4 gap-x-6 gap-y-8 mt-12">

          <div v-for="book in booksStore.searchedBooks.filteredData" class="border-black/80 border-2 flex flex-col justify-between px-6 py-4 rounded-md transition-shadow hover:shadow-lg" :key="book.key.replace('/works/','')">
            
            <div>
              <h4 class="font-semibold mb-1">{{ book.title }}</h4>

              <!-- Auteur -->
              <div>
                <RouterLink class="hover:underlined" :to="'/search-author?author='+book.author_name" v-if="book.author_name"><p >{{ book.author_name[0] }}</p></RouterLink>
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

            <div class="flex justify-end"> 
              <RouterLink :to="{'name':'DisplayBook', params:{id:book.key.replace('/works/','')}}" >
                <button class="bg-black/40 text-white mt-4 px-4 py-2 rounded-md text-sm transition-colors hover:bg-black/80">Accéder à la fiche</button>
              </RouterLink>
            </div>
           
          </div>
        
      </div>
      <div class="flex justify-end px-10 mt-10">
        <button @click="fetchMoreBooks" v-if="booksStore.searchedBooks.data.length" :disabled="booksStore.searchedBooks.data.length == booksStore.searchedBooks.nbResults || loaderStore.isLoading" class="bg-black/80 text-white px-4 py-2 rounded-md disabled:opacity-50">Afficher plus de livres</button>
      </div>
    </div>
    
  </main>
</template>

<script setup lang="ts">
import axios from 'axios'
import { createToaster } from "@meforma/vue-toaster";
import { useLoaderStore } from '@/stores/loader';
import {useBooksStore} from '@/stores/books'
import {ref} from 'vue'

const booksStore = useBooksStore()
const loaderStore = useLoaderStore()
const toaster = createToaster();

const nbPagesFilter = ref(0)

const fetchBooks = async () => {
  loaderStore.setIsLoading(true)
  try{
    if(booksStore.searchBooksInput.length<5 || booksStore.searchBooksInput.includes('  ')){
      throw new Error("Merci de saisir au moins 5 caractères pour votre recherche (sans double espace).")
    }
    const response = await axios.get(`https://openlibrary.org/search.json?title=${booksStore.searchBooksInput.replace(' ','+')}&page=1`)
    
    if(response.data.docs.length==0){
      throw new Error("Aucun résultat, veuillez rééssayer avec d'autres mots clés.")
    }

    booksStore.searchedBooks.data = response.data.docs
    booksStore.searchedBooks.filteredData = response.data.docs
    booksStore.searchedBooks.nbResults = response.data.numFound
    booksStore.searchedBooks.searchInput = booksStore.searchBooksInput
    booksStore.searchedBooks.nextPageNumber = 2

    nbPagesFilter.value=0
  }
  catch(e){
    if (e instanceof Error) {
      toaster.error(e.message)
    }
  }
  loaderStore.setIsLoading(false)
}

const fetchMoreBooks = async () => {
  loaderStore.setIsLoading(true)
  const response = await axios.get(`https://openlibrary.org/search.json?title=${booksStore.searchedBooks.searchInput.replace(' ','+')}&page=${booksStore.searchedBooks.nextPageNumber}`)
  booksStore.searchedBooks.data = booksStore.searchedBooks.data.concat(response.data.docs)
  booksStore.searchedBooks.nextPageNumber = booksStore.searchedBooks.nextPageNumber+1
  filterBooks()
  loaderStore.setIsLoading(false)
}

const filterBooks = () => {
  if(nbPagesFilter.value == 0){
    booksStore.searchedBooks.filteredData = booksStore.searchedBooks.data
  }
  else{
    booksStore.searchedBooks.filteredData = booksStore.searchedBooks.data.filter(book=> book.number_of_pages_median && book.number_of_pages_median > nbPagesFilter.value)
  }
}

</script>
