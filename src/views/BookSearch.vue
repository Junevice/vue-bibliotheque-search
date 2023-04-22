<template>
  <main class="px-32 py-8 min-h-screen">
    <h2 class="text-xl font-semibold">Rechercher un livre</h2>
    <form @submit.prevent="fetchBooks" class="ml-8 my-4 flex gap-8">
      <input type="text" class="border-2 px-2 rounded-md" placeholder="Nom de l'ouvrage" v-model="booksStore.searchBooksInput">
      <button type="submit" :disabled="loaderStore.isLoading" class="bg-black/80 text-white px-4 py-2 rounded-md disabled:opacity-50">Rechercher</button>
    </form>

    <div v-if="booksStore.searchedBooks.nbResults" class="mt-16">
      <div class="my-8 w-full flex justify-between text-md px-10">
        <div>
          <p>Recherche en cours : <span class="italic">{{ booksStore.searchedBooks.searchInput }}</span></p>
        </div>
        <div>
          {{ booksStore.searchedBooks.data.length }} / {{ booksStore.searchedBooks.nbResults }} résultats
        </div>
      </div>

      <div class="grid grid-cols-4 gap-x-6 gap-y-8 mt-12">
        <RouterLink v-for="book in booksStore.searchedBooks.data" class="border-black/80 border-2 px-6 py-4 rounded-md" :key="book.key.replace('/works/','')" :to="{'name':'DisplayBook', params:{id:book.key.replace('/works/','')}}">
          <div>
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
        </RouterLink>
      </div>
      <div class="flex justify-end px-10 mt-10">
        <button @click="fetchMoreBooks" v-if="booksStore.searchedBooks.data.length" :disabled="booksStore.searchedBooks.data.length == booksStore.searchedBooks.nbResults || loaderStore.isLoading" class="bg-black/80 text-white px-4 py-2 rounded-md disabled:opacity-50">Afficher plus de livres</button>
      </div>
    </div>
    
  </main>
</template>

<script setup lang="ts">
import axios from 'axios'
import {reactive, ref} from 'vue'
import { createToaster } from "@meforma/vue-toaster";
import { useLoaderStore } from '@/stores/loader';
import {useBooksStore} from '@/stores/books'

const booksStore = useBooksStore()
const loaderStore = useLoaderStore()
const toaster = createToaster();







const fetchBooks = async () => {
  loaderStore.setIsLoading(true)
  try{
    if(booksStore.searchBooksInput.length<5 || booksStore.searchBooksInput.includes('  ')){
      throw new Error("Merci de saisir au moins 5 caractères pour votre recherche (sans double espace).")
    }
    const response = await axios.get(`https://openlibrary.org/search.json?title=${booksStore.searchBooksInput.replace(' ','+')}&page=1`)
    console.log(response)
    booksStore.searchedBooks.data = response.data.docs
    booksStore.searchedBooks.nbResults = response.data.numFound
    booksStore.searchedBooks.searchInput = booksStore.searchBooksInput
    booksStore.searchedBooks.nextPageNumber = 2
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
  loaderStore.setIsLoading(false)
}


</script>
