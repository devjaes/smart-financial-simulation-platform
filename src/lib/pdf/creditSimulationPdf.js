import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency } from '../currency.js'

/**
 * @param {object} opts
 * @param {{ nombre: string, ruc: string, logoDataUrl?: string, lema?: string, pieDocumentos?: string }} opts.institution
 * @param {object} opts.client { nombre, documento, email }
 * @param {object} opts.credit { tipo, monto, plazoMeses, periodicity, methodLabel }
 * @param {import('../amortization.js').AmortizationResult} opts.result
 * @param {string} opts.simulationId
 * @param {string} [opts.observations]
 */
export function downloadCreditSimulationPdf({
  institution,
  client,
  credit,
  result,
  simulationId,
  observations = '',
}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  let y = 16

  if (institution.logoDataUrl) {
    try {
      doc.addImage(institution.logoDataUrl, 'PNG', 14, y, 22, 22)
    } catch {
      /* ignore invalid image */
    }
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(institution.nombre || 'Institución', institution.logoDataUrl ? 40 : 14, y + 8)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80)
  doc.text(institution.lema || '', 14, y + 26)

  doc.setTextColor(0)
  doc.setFontSize(11)
  doc.text('Simulación de crédito', 14, y + 34)
  doc.setFontSize(9)
  doc.text(`N° simulación: ${simulationId}`, pageW - 14, y + 34, { align: 'right' })
  doc.text(`Fecha: ${new Date().toLocaleString('es-EC')}`, pageW - 14, y + 40, { align: 'right' })

  y += 48
  doc.setFont('helvetica', 'bold')
  doc.text('Datos del cliente', 14, y)
  doc.setFont('helvetica', 'normal')
  y += 6
  doc.text(`Nombre: ${client.nombre}`, 14, y)
  y += 5
  doc.text(`Documento: ${client.documento}`, 14, y)
  y += 5
  doc.text(`Correo: ${client.email}`, 14, y)

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Condiciones del crédito', 14, y)
  doc.setFont('helvetica', 'normal')
  y += 6
  doc.text(`Producto: ${credit.tipo}`, 14, y)
  y += 5
  doc.text(`Monto: ${formatCurrency(credit.monto)}`, 14, y)
  y += 5
  doc.text(`Plazo (meses): ${credit.plazoMeses}`, 14, y)
  y += 5
  doc.text(`Periodicidad: ${credit.periodicity}`, 14, y)
  y += 5
  doc.text(`Sistema de amortización: ${credit.methodLabel}`, 14, y)

  y += 8
  doc.setFont('helvetica', 'bold')
  doc.text('Resumen financiero', 14, y)
  doc.setFont('helvetica', 'normal')
  y += 6
  doc.text(`Total a pagar (cuotas + cargos en cuota): ${formatCurrency(result.totalPaid)}`, 14, y)
  y += 5
  doc.text(`Total intereses: ${formatCurrency(result.totalInterest)}`, 14, y)
  y += 5
  doc.text(`Total cargos/seguro en cronograma: ${formatCurrency(result.totalCharges)}`, 14, y)

  const body = result.schedule.map((r) => [
    r.period,
    formatCurrency(r.payment),
    formatCurrency(r.interest),
    formatCurrency(r.principal),
    formatCurrency(r.balance),
  ])

  autoTable(doc, {
    startY: y + 6,
    head: [['#', 'Cuota', 'Interés', 'Capital', 'Saldo']],
    body,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [14, 116, 144] },
  })

  const finalY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : y + 80
  doc.setFontSize(8)
  doc.setTextColor(60)
  doc.text('Observaciones legales: esta simulación es referencial y no constituye oferta vinculante.', 14, finalY)
  if (observations) {
    doc.text(observations, 14, finalY + 5)
  }
  doc.text(institution.pieDocumentos || '', 14, finalY + 12)

  doc.save(`SFICI-simulacion-${simulationId}.pdf`)
}
