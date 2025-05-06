<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from "@/components/Navbar.vue"
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const filters = ref([
  { label: 'A-Z (Nombres)', value: 'name_az' },
  { label: 'Z-A (Nombres)', value: 'name_za' },
  { label: 'A-Z (Apellidos)', value: 'lastName_az' },
  { label: 'Z-A (Apellidos)', value: 'lastName_za' },
  { label: 'A-Z (Nacionalidad)', value: 'nationality_az' },
  { label: 'Z-A (Nacionalidad)', value: 'nationality_za' }
])

const selectedFilter = ref('-')
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
  switch (selectedFilter.value) {
    case 'name_az':
      authors.value.sort((a, b) => a.names.localeCompare(b.names))
      break
    case 'name_za':
      authors.value.sort((a, b) => b.names.localeCompare(a.names))
      break
    case 'lastName_az':
      authors.value.sort((a, b) => a.lastNames.localeCompare(b.lastNames))
      break
    case 'lastName_za':
      authors.value.sort((a, b) => b.lastNames.localeCompare(a.lastNames))
      break
    case 'nationality_az':
      authors.value.sort((a, b) => a.nationality.localeCompare(b.nationality))
      break
    case 'nationality_za':
      authors.value.sort((a, b) => b.nationality.localeCompare(a.nationality))
      break
    default:
      break
  }
}

const generatePDF = () => {
  alert("Generando PDF...")

  const doc = new jsPDF()

  doc.text('Lista de Autores', 14, 20)

  autoTable(doc, {
    startY: 30,
    head: [['Nombres', 'Apellidos', 'Nacionalidad']],
    body: authors.value.map(author => [
      author.names,
      author.lastNames,
      author.nationality
    ]),
  })

  doc.save('authors.pdf')
}

const generateCSV = async () => {
  alert("Generando CSV...")

  try {
    const response = await fetch('http://localhost:8080/api/authors/csv', {
      method: 'GET',
    })

    if (!response.ok) throw new Error('Error al generar CSV')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'autores.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generando CSV:', error)
    alert('Hubo un error al generar el CSV.')
  }
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
