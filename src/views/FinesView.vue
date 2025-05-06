<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from "@/components/Navbar.vue";
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const filters = ref([
  { label: 'Mayor monto', value: 'amount_desc' },
  { label: 'Menor monto', value: 'amount_asc' },
  { label: 'Fecha de pago más reciente', value: 'recent_payment' },
  { label: 'Fecha de pago más antigua', value: 'oldest_payment' }
])

const selectedFilter = ref('-')
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
  if (selectedFilter.value === 'amount_desc') {
    fines.value.sort((a, b) => b.amount - a.amount)
  } else if (selectedFilter.value === 'amount_asc') {
    fines.value.sort((a, b) => a.amount - b.amount)
  } else if (selectedFilter.value === 'recent_payment') {
    fines.value.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
  } else if (selectedFilter.value === 'oldest_payment') {
    fines.value.sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())
  }
}

const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString('es-ES')
}

const generatePDF = () => {
  alert("Generando PDF...");

  const doc = new jsPDF();

  doc.text('Lista de Multas', 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [['ID Préstamo', 'Monto', 'Razón', 'Fecha de Pago']],
    body: fines.value.map(fine => [
      fine.loanId.toString(),
      `Q ${fine.amount.toFixed(2)}`,
      fine.reason,
      formatDate(fine.paymentDate)
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [231, 76, 60] },
  });

  doc.save('fines.pdf');
}

const generateCSV = async () => {
  alert("Generando CSV...")

  try {
    const response = await fetch('http://localhost:8080/api/fines/csv', {
      method: 'GET',
    })

    if (!response.ok) throw new Error('Error al generar CSV')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'fines.csv')
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
