<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from "@/components/Navbar.vue";
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const filters = ref([
  { label: 'A-Z (Nombre)', value: 'name_az' },
  { label: 'Z-A (Nombre)', value: 'name_za' },
  { label: 'A-Z (Apellido)', value: 'lastName_az' },
  { label: 'Z-A (Apellido)', value: 'lastName_za' }
])

const selectedFilter = ref('-')
const clients = ref<{ names: string; lastNames: string; address: string; phone: string; email: string }[]>([])

const fetchClients = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/clients/')
    if (!response.ok) throw new Error('Failed to fetch clients')
    const data = await response.json()
    clients.value = data
    sortClients()
  } catch (error) {
    console.error('Error fetching clients:', error)
  }
}

const sortClients = () => {
  switch (selectedFilter.value) {
    case 'name_az':
      clients.value.sort((a, b) => a.names.localeCompare(b.names))
      break
    case 'name_za':
      clients.value.sort((a, b) => b.names.localeCompare(a.names))
      break
    case 'lastName_az':
      clients.value.sort((a, b) => a.lastNames.localeCompare(b.lastNames))
      break
    case 'lastName_za':
      clients.value.sort((a, b) => b.lastNames.localeCompare(a.lastNames))
      break
    default:
      break
  }
}

const generatePDF = () => {
  alert("Generando PDF...")

  const doc = new jsPDF()

  doc.text('Lista de Clientes', 14, 20)

  autoTable(doc, {
    startY: 30,
    head: [['Nombres', 'Apellidos', 'Dirección', 'Teléfono', 'Email']],
    body: clients.value.map(client => [
      client.names,
      client.lastNames,
      client.address,
      client.phone,
      client.email
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  })

  doc.save('clients.pdf')
}

const generateCSV = async () => {
  alert("Generando CSV...")

  try {
    const response = await fetch('http://localhost:8080/api/clients/csv', {
      method: 'GET',
    })

    if (!response.ok) throw new Error('Error al generar CSV')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'clients.csv')
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
	fetchClients()
})
</script>

<template>
  <!-- Navbar -->
  <Navbar />

  <div class="mt-5 pt-5 mx-auto" style="width: 90%;">
    <!-- Título -->
    <h1>Clientes</h1>
    
    <!-- Filtro y Botones -->
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <div>
        <label for="filter" class="form-label">Filtrar por:</label>
        <select id="filter" v-model="selectedFilter" class="form-select" @change="sortClients">
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

    <!-- Tabla de Clientes -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in clients" :key="client.names + client.lastNames">
          <td>{{ client.names }}</td>
          <td>{{ client.lastNames }}</td>
          <td>{{ client.address }}</td>
          <td>{{ client.phone }}</td>
          <td>{{ client.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<style scoped></style>
