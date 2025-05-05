<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from "@/components/Navbar.vue";

const filters = ref([
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' }
])

const selectedFilter = ref('az')
const fines = ref<{ loanId: number; amount: number; reason: string; paymentDate: string }[]>([])

const fetchFines = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/fines/')
    if (!response.ok) throw new Error('Failed to fetch fines')
    const data = await response.json()
    fines.value = data
    sortFines()
  } catch (error) {
    console.error('Error fetching fines:', error)
  }
}

const sortFines = () => {
  if (selectedFilter.value === 'az') {
    fines.value.sort((a, b) => a.loanId - b.loanId)
  } else if (selectedFilter.value === 'za') {
    fines.value.sort((a, b) => b.loanId - a.loanId)
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
	fetchFines()
})
</script>

<template>
  <!-- Navbar -->
  <Navbar />

  <div class="mt-5 pt-5 mx-auto" style="width: 90%;">
    <!-- Título -->
    <h1>Multas</h1>

    <!-- Filtro y Botones -->
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <div>
        <label for="filter" class="form-label">Filtrar por:</label>
        <select id="filter" v-model="selectedFilter" class="form-select" @change="sortFines">
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

    <!-- Tabla de Multas -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID Préstamo</th>
          <th>Monto</th>
          <th>Razón</th>
          <th>Fecha de Pago</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fine in fines" :key="fine.loanId">
          <td>{{ fine.loanId }}</td>
          <td>Q {{ fine.amount }}</td>
          <td>{{ fine.reason }}</td>
          <td>{{ formatDate(fine.paymentDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
