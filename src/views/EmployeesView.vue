<script setup lang="ts">
import { ref } from 'vue'
import Navbar from "@/components/Navbar.vue";

const filters = ref([
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' }
])

const selectedFilter = ref('az')

const employees = ref([
  { names: 'Carlos', last_names: 'Ramírez', hiring_date: '2015-03-01' },
  { names: 'Luisa', last_names: 'Fernández', hiring_date: '2018-07-15' },
  { names: 'Miguel', last_names: 'Santos', hiring_date: '2020-11-20' },
  { names: 'Ana', last_names: 'Morales', hiring_date: '2012-01-10' }
])

const sortEmployees = () => {
  if (selectedFilter.value === 'az') {
    employees.value.sort((a, b) => a.names.localeCompare(b.names))
  } else if (selectedFilter.value === 'za') {
    employees.value.sort((a, b) => b.names.localeCompare(a.names))
  }
}

const generatePDF = () => {
  alert("Generando PDF...");
}

const generateCSV = () => {
  alert("Generando CSV...");
}
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
        <tr v-for="employee in employees" :key="employee.names + employee.last_names">
          <td>{{ employee.names }}</td>
          <td>{{ employee.last_names }}</td>
          <td>{{ employee.hiring_date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>