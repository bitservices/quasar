<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md shadow-2" ref="reportContent">
      <div class="text-h5 q-mb-md">Sales Report</div>

      <div class="q-mb-md">
        <p><strong>Date:</strong> {{ today }}</p>
        <p><strong>Total Revenue:</strong> $12,000</p>
      </div>

      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        flat
        bordered
      />

      <q-btn label="Export to PDF" color="primary" icon="picture_as_pdf" class="q-mt-md" @click="exportToPdf" />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const today = new Date().toLocaleDateString()

const reportContent = ref(null)

const columns = [
  { name: 'product', label: 'Product', field: 'product', align: 'left' },
  { name: 'qty', label: 'Quantity', field: 'qty', align: 'right' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' }
]

const rows = [
  { id: 1, product: 'Widget A', qty: 10, total: '$100' },
  { id: 2, product: 'Widget B', qty: 5, total: '$50' }
]

const exportToPdf = async () => {
  const el = reportContent.value.$el || reportContent.value
  const canvas = await html2canvas(el, {
    scale: 2
  })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save('report.pdf')
}
</script>
