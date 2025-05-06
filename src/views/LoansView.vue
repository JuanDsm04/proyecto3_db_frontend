<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from "@/components/Navbar.vue";
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const filters = ref([
  { label: 'Más reciente préstamo', value: 'recent_loan' },
  { label: 'Más antiguo préstamo', value: 'oldest_loan' },
  { label: 'Más reciente devolución', value: 'recent_return' },
  { label: 'Más antigua devolución', value: 'oldest_return' },
  { label: 'Por ID Cliente (asc)', value: 'clientId_asc' },
  { label: 'Por ID Cliente (desc)', value: 'clientId_desc' }
])

const selectedFilter = ref('-');
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
  switch (selectedFilter.value) {
    case 'recent_loan':
      loans.value.sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime())
      break
    case 'oldest_loan':
      loans.value.sort((a, b) => new Date(a.loanDate).getTime() - new Date(b.loanDate).getTime())
      break
    case 'recent_return':
      loans.value.sort((a, b) => new Date(b.returnDate).getTime() - new Date(a.returnDate).getTime())
      break
    case 'oldest_return':
      loans.value.sort((a, b) => new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime())
      break
    case 'clientId_asc':
      loans.value.sort((a, b) => a.clientId - b.clientId)
      break
    case 'clientId_desc':
      loans.value.sort((a, b) => b.clientId - a.clientId)
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

  doc.text('Lista de Préstamos', 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [['ID Cliente', 'ID Empleado', 'ID Edición', 'Fecha de Préstamo', 'Fecha de Devolución']],
    body: loans.value.map(loan => [
      loan.clientId.toString(),
      loan.employeeId.toString(),
      loan.editionId.toString(),
      formatDate(loan.loanDate),
      formatDate(loan.returnDate)
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 123, 255] },
  });

  doc.save('loans.pdf');
}

const generateCSV = async () => {
  alert("Generando CSV...")

  try {
    const response = await fetch('http://localhost:8080/api/loans/csv', {
      method: 'GET',
    })

    if (!response.ok) throw new Error('Error al generar CSV')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'loans.csv')
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
