import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'


export const useBooksStore = defineStore('books', () => {
  
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

    const searchBooksInput = ref('')

    const searchedBooks = reactive<booksDataType>({
        data : [],
        nbResults : 0,
        nextPageNumber : 1,
        searchInput:''
    })

  return { searchedBooks, searchBooksInput }
})