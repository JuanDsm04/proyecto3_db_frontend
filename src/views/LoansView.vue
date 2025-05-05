<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from "@/components/Navbar.vue";

const filters = ref([
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' }
])

const selectedFilter = ref('az')
const loans = ref<{ clientId: number; employeeId: number; editionId: number; loanDate: string; returnDate: string }[]>([])

const fetchLoans = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/loans/')
    if (!response.ok) throw new Error('Failed to fetch loans')
    const data = await response.json()
    loans.value = data
    sortLoans()
  } catch (error) {
    console.error('Error fetching loans:', error)
  }
}

const sortLoans = () => {
  if (selectedFilter.value === 'az') {
    loans.value.sort((a, b) => a.clientId - b.clientId)
  } else if (selectedFilter.value === 'za') {
    loans.value.sort((a, b) => b.clientId - a.clientId)
  }
}

const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString('es-ES')
}

const generatePDF = () => {
  alert("Generando PDF...");
}

const generateCSV = () => {
  alert("Generando CSV...");
}

onMounted(() => {
	fetchLoans()
})
</script>

<template>
  <!-- Navbar -->
  <Navbar />

  <div class="mt-5 pt-5 mx-auto" style="width: 90%;">
    <!-- Título -->
    <h1>Préstamos</h1>

    <!-- Filtro y Botones -->
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <div>
        <label for="filter" class="form-label">Filtrar por:</label>
        <select id="filter" v-model="selectedFilter" class="form-select" @change="sortLoans">
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

    <!-- Tabla de Préstamos -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID Cliente</th>
          <th>ID Empleado</th>
          <th>ID Edición</th>
          <th>Fecha de Préstamo</th>
          <th>Fecha de Devolución</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="loan in loans" :key="loan.clientId + '-' + loan.editionId">
          <td>{{ loan.clientId }}</td>
          <td>{{ loan.employeeId }}</td>
          <td>{{ loan.editionId }}</td>
          <td>{{ formatDate(loan.loanDate) }}</td>
          <td>{{ formatDate(loan.returnDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
