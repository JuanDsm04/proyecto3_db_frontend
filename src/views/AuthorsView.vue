<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from "@/components/Navbar.vue"

const filters = ref([
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' }
])

const selectedFilter = ref('az')
const authors = ref<{ names: string; lastNames: string; nationality: string }[]>([])

const fetchAuthors = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/authors/')
    if (!response.ok) throw new Error('Failed to fetch authors')
    const data = await response.json()
    authors.value = data
    sortAuthors()
  } catch (error) {
    console.error('Error fetching authors:', error)
  }
}

const sortAuthors = () => {
  if (selectedFilter.value === 'az') {
    authors.value.sort((a, b) => a.names.localeCompare(b.names))
  } else if (selectedFilter.value === 'za') {
    authors.value.sort((a, b) => b.names.localeCompare(a.names))
  }
}

const generatePDF = () => {
  alert("Generando PDF...")
}

const generateCSV = () => {
  alert("Generando CSV...")
}

onMounted(() => {
  fetchAuthors()
})
</script>


<template>
  <!-- Navbar -->
  <Navbar />

  <div class="mt-5 pt-5 mx-auto" style="width: 90%;">
    <!-- Título -->
    <h1>Autores</h1>

    <!-- Filtro y Botones -->
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <div>
        <label for="filter" class="form-label">Filtrar por:</label>
        <select id="filter" v-model="selectedFilter" class="form-select" @change="sortAuthors">
          <option v-for="filter in filters" :key="filter.value" :value="filter.value">
            {{ filter.label }}
          </option>
        </select>
      </div>

      <div>
        <button class="btn btn-primary" @click="generatePDF">Generar PDF</button>
        <button class="btn btn-success ms-2" @click="generateCSV">Generar CSV</button>
      </div>
    </div>

    <!-- Tabla de Autores -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Nacionalidad</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="author in authors" :key="author.names + author.lastNames">
          <td>{{ author.names }}</td>
          <td>{{ author.lastNames }}</td>
          <td>{{ author.nationality }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
