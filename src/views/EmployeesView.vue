<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from "@/components/Navbar.vue";
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const filters = ref([
  { label: 'A-Z (Nombre)', value: 'name_az' },
  { label: 'Z-A (Nombre)', value: 'name_za' },
  { label: 'A-Z (Apellido)', value: 'lastName_az' },
  { label: 'Z-A (Apellido)', value: 'lastName_za' },
  { label: 'Más reciente contratación', value: 'recent_hiring' },
  { label: 'Más antigua contratación', value: 'oldest_hiring' }
])

const selectedFilter = ref('-')
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
  switch (selectedFilter.value) {
    case 'name_az':
      employees.value.sort((a, b) => a.names.localeCompare(b.names))
      break
    case 'name_za':
      employees.value.sort((a, b) => b.names.localeCompare(a.names))
      break
    case 'lastName_az':
      employees.value.sort((a, b) => a.lastNames.localeCompare(b.lastNames))
      break
    case 'lastName_za':
      employees.value.sort((a, b) => b.lastNames.localeCompare(a.lastNames))
      break
    case 'recent_hiring':
      employees.value.sort((a, b) => new Date(b.hiringDate).getTime() - new Date(a.hiringDate).getTime())
      break
    case 'oldest_hiring':
      employees.value.sort((a, b) => new Date(a.hiringDate).getTime() - new Date(b.hiringDate).getTime())
      break
    default:
      break
  }
}

const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString('es-ES')
}

const generatePDF = () => {
  alert("Generando PDF...");

  const doc = new jsPDF();

  doc.text('Lista de Empleados', 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [['Nombres', 'Apellidos', 'Fecha de Contratación']],
    body: employees.value.map(employee => [
      employee.names,
      employee.lastNames,
      formatDate(employee.hiringDate)
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [60, 141, 188] },
  });

  doc.save('employees.pdf');
}

const generateCSV = async () => {
  alert("Generando CSV...")

  try {
    const response = await fetch('http://localhost:8080/api/employees/csv', {
      method: 'GET',
    })

    if (!response.ok) throw new Error('Error al generar CSV')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'employees.csv')
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
