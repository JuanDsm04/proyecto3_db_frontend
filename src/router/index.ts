import { createRouter, createWebHistory } from 'vue-router'
import Clients from '@/views/ClientsView.vue'
import Authors from '@/views/AuthorsView.vue'
import Employees from '@/views/EmployeesView.vue'
import Loans from '@/views/LoansView.vue'
import Fines from '@/views/FinesView.vue'

const routes = [
  { path: '/', name: 'Clients', component: Clients },
  { path: '/authors', name: 'Authors', component: Authors },
  { path: '/employees', name: 'Employees', component: Employees },
  { path: '/loans', name: 'Loans', component: Loans },
  { path: '/fines', name: 'Fines', component: Fines }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
