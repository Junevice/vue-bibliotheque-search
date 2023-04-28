<template>
  <main class="px-32 py-8 min-h-screen">
    <button class="mb-2 hover:underline" @click="redirectBack">Retour à votre recherche</button>
    <h1 class="text-2xl font-semibold">{{ book.title }}</h1>
    <a :href="book.author.wikipedia" v-if="book.author.wikipedia"><h2 class="text-xl hover:underline">{{ book.author.name ? book.author.name : 'Auteur anonyme'}}</h2></a>
    <h2 class="text-xl" v-else>{{ book.author.name ? book.author.name : 'Auteur anonyme'}}</h2>

    <div class="my-8 flex gap-16 justify-between">
      <div class="w-2/3 flex flex-col gap-8">
        <div class="w-full flex flex-col">
          <h3 class="text-xl font-semibold mb-1" v-if="book.author.bio || book.author.birthDate">About the author</h3>
          <p class="mb-1">{{ book.author.bio }}</p>
          <p v-if="book.author.birthDate">Birth date : {{ book.author.birthDate }}</p>
        </div>

        <div class="w-full" v-if="book.description">
          <h3 class="text-xl mb-1 font-semibold">About the book</h3>
          <p>{{ book.description }}</p>
        </div>
        
      </div>  
      <div class="w-1/3 flex justify-center items-start">
        <img :src="`https://covers.openlibrary.org/b/id/${book.cover}-L.jpg`" class="rounded-lg"/>
      </div>
    </div>
  </main>
</template>

<!-- Pour les champs vides créant un bug dans l'affichage lors de l'entrée. Trouver des composants squelettes pour que tout soit smooth -->
<!-- Ou juste un v-if v-else : avec le v-else qui s'affiche plus de problème d'affichage -->
<script setup lang="ts">
import {reactive} from 'vue'
import axios from 'axios';
import { onMounted } from 'vue';
import { createToaster } from "@meforma/vue-toaster";
import { useLoaderStore } from '@/stores/loader';
import { useRouter } from 'vue-router';

const toaster = createToaster()
const loader = useLoaderStore()
const router = useRouter()

const props = defineProps({
  id:{
    required:true,
    type:String
  }
})

type BookType = {
  title:string,
  description:string
  author:{
    name:string,
    wikipedia:string,
    bio:string,
    birthDate:string,
  },
  cover:string
}

const book = reactive<BookType>({title:'', description:'', author:{name:'', wikipedia:'', bio:'', birthDate:''}, cover:''})

onMounted(async()=>{
  loader.setIsLoading(true)
  try{
    const bookResponse = await axios.get(`https://openlibrary.org/works/${props.id}.json`)
    console.log(bookResponse)
    book.title=bookResponse.data.title
    book.description=bookResponse.data.description
    if(bookResponse.data.authors.length){
      const authorResponse = await axios.get(`https://openlibrary.org${bookResponse.data.authors[0].author.key}.json`)
      book.author.name=authorResponse.data.name
      book.author.wikipedia=authorResponse.data.wikipedia
      book.author.bio=authorResponse.data.bio
      book.author.birthDate=authorResponse.data.birth_date
      if(bookResponse.data.covers && bookResponse.data.covers.length){
        book.cover=bookResponse.data.covers[0]
      }
      console.log(authorResponse)
    } 
    
    book.title = bookResponse.data.title
  }catch(e){
    if(e instanceof Error){
      toaster.error(e.message)
    }
  }
  loader.setIsLoading(false)
})

const redirectBack = () =>{
  router.back()
}

</script>