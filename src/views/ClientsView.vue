<script setup lang="ts">
import { ref } from 'vue'
import Navbar from "@/components/Navbar.vue";

const filters = ref([
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' }
])

const selectedFilter = ref('az')

const clients = ref([
  { firstName: 'Juan', lastName: 'Pérez', address: 'Calle Falsa 123', phone: '123456789', email: 'jupe@gmail.com'},
  { firstName: 'Ana', lastName: 'González', address: 'Calle Real 456', phone: '987654321', email: 'anago@gmail.com' },
  { firstName: 'Pedro', lastName: 'López', address: 'Avenida Libertad 789', phone: '654321987', email: 'pelo@gmail.com'},
  { firstName: 'Laura', lastName: 'Martínez', address: 'Calle Sol 321', phone: '321654987', email: 'lama@gmail.com' },
])

const sortClients = () => {
  if (selectedFilter.value === 'az') {
    clients.value.sort((a, b) => a.firstName.localeCompare(b.firstName))
  } else if (selectedFilter.value === 'za') {
    clients.value.sort((a, b) => b.firstName.localeCompare(a.firstName))
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
        <tr v-for="client in clients" :key="client.firstName + client.lastName">
          <td>{{ client.firstName }}</td>
          <td>{{ client.lastName }}</td>
          <td>{{ client.address }}</td>
          <td>{{ client.phone }}</td>
          <td>{{ client.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<style scoped></style>