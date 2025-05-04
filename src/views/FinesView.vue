<script setup lang="ts">
import { ref } from 'vue'
import Navbar from "@/components/Navbar.vue";

const filters = ref([
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' }
])

const selectedFilter = ref('az')

const fines = ref([
  { loan_id: 1, amount: 50, reason: 'Retraso en devolución', date_payment: '2023-01-22' },
  { loan_id: 2, amount: 30, reason: 'Retraso en devolución', date_payment: '2023-02-28' },
  { loan_id: 3, amount: 70, reason: 'Libro dañado', date_payment: '2023-03-15' },
  { loan_id: 4, amount: 40, reason: 'Retraso en devolución', date_payment: '2023-04-17' }
])

const sortFines = () => {
  if (selectedFilter.value === 'az') {
    fines.value.sort((a, b) => a.loan_id - b.loan_id)
  } else if (selectedFilter.value === 'za') {
    fines.value.sort((a, b) => b.loan_id - a.loan_id)
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
        <tr v-for="fine in fines" :key="fine.loan_id">
          <td>{{ fine.loan_id }}</td>
          <td>Q {{ fine.amount }}</td>
          <td>{{ fine.reason }}</td>
          <td>{{ fine.date_payment }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
