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
        filteredData:{
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
    const authorInput = ref('')

    const nbPagesFilterBook = ref(0)
    const nbPagesFilterAuthor = ref(0)


    const searchedBooks = reactive<booksDataType>({
      data : [],
      filteredData : [],
      nbResults : 0,
      nextPageNumber : 1,
      searchInput:''
    })

    const searchedBooksByAutors = reactive<booksDataType>({
      data : [],
      filteredData:[],
      nbResults : 0,
      nextPageNumber : 1,
      searchInput:''
    })

    const resetAuthorBooks = () => {
      searchedBooksByAutors.data=[]
      searchedBooksByAutors.nbResults=0
      searchedBooksByAutors.nextPageNumber=1
      searchedBooksByAutors.searchInput=''
    }

  return { searchedBooks, searchBooksInput, nbPagesFilterBook, nbPagesFilterAuthor,  authorInput, searchedBooksByAutors, resetAuthorBooks }
})