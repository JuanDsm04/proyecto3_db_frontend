<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from "@/components/Navbar.vue";

const filters = ref([
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' }
])

const selectedFilter = ref('az')
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
  if (selectedFilter.value === 'az') {
    clients.value.sort((a, b) => a.names.localeCompare(b.names))
  } else if (selectedFilter.value === 'za') {
    clients.value.sort((a, b) => b.names.localeCompare(a.names))
  }
}

const generatePDF = () => {
  alert("Generando PDF...");
}

const generateCSV = () => {
  alert("Generando CSV...");
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
