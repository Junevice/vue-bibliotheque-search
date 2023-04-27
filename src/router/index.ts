import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import BookSearch from '../views/BookSearch.vue'
import AuthorSearch from '../views/AuthorSearch.vue'
import BookDisplay from '../views/BookDisplay.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/search-book',
      name: 'SearchBook',
      component: BookSearch
    },
    {
      path: '/search-author',
      name: 'SearchAuthor',
      component: AuthorSearch
    },
    {
      path: '/book/:id',
      name: 'DisplayBook',
      component: BookDisplay,
      props:true
    },
  ]
})

export default router
