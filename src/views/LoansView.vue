<script setup lang="ts">
import { ref } from 'vue'
import Navbar from "@/components/Navbar.vue";

const filters = ref([
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' }
])

const selectedFilter = ref('az')

const loans = ref([
  { id_client: 1, id_employee: 101, id_edition: 501, loan_date: '2023-01-10', return_date: '2023-01-20' },
  { id_client: 2, id_employee: 102, id_edition: 502, loan_date: '2023-02-15', return_date: '2023-02-25' },
  { id_client: 3, id_employee: 103, id_edition: 503, loan_date: '2023-03-01', return_date: '2023-03-11' },
  { id_client: 4, id_employee: 104, id_edition: 504, loan_date: '2023-04-05', return_date: '2023-04-15' }
])

const sortLoans = () => {
  if (selectedFilter.value === 'az') {
    loans.value.sort((a, b) => a.id_client - b.id_client)
  } else if (selectedFilter.value === 'za') {
    loans.value.sort((a, b) => b.id_client - a.id_client)
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
        <tr v-for="loan in loans" :key="loan.id_client + '-' + loan.id_edition">
          <td>{{ loan.id_client }}</td>
          <td>{{ loan.id_employee }}</td>
          <td>{{ loan.id_edition }}</td>
          <td>{{ loan.loan_date }}</td>
          <td>{{ loan.return_date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>