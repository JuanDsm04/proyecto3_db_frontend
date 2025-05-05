<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from "@/components/Navbar.vue";

const filters = ref([
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' }
])

const selectedFilter = ref('az')
const employees = ref<{ names: string; lastNames: string; hiringDate: string }[]>([])

const fetchEmployees = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/employees/')
    if (!response.ok) throw new Error('Failed to fetch clients')
    const data = await response.json()
    employees.value = data
    sortEmployees()
  } catch (error) {
    console.error('Error fetching clients:', error)
  }
}

const sortEmployees = () => {
  if (selectedFilter.value === 'az') {
    employees.value.sort((a, b) => a.names.localeCompare(b.names))
  } else if (selectedFilter.value === 'za') {
    employees.value.sort((a, b) => b.names.localeCompare(a.names))
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
	fetchEmployees()
})
</script>

<template>
  <!-- Navbar -->
  <Navbar />

  <div class="mt-5 pt-5 mx-auto" style="width: 90%;">
    <!-- Título -->
    <h1>Empleados</h1>

    <!-- Filtro y Botones -->
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <div>
        <label for="filter" class="form-label">Filtrar por:</label>
        <select id="filter" v-model="selectedFilter" class="form-select" @change="sortEmployees">
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

    <!-- Tabla de Empleados -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Fecha de Contratación</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.names + employee.lastNames">
          <td>{{ employee.names }}</td>
          <td>{{ employee.lastNames }}</td>
          <td>{{ formatDate(employee.hiringDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
