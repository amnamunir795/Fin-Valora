import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportReportPdf({
  title,
  periodLabel,
  userName,
  summaryBody,
  cashFlowBody,
  tables,
  filename,
}) {
  const doc = new jsPDF();
  let y = 16;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Period: ${periodLabel}`, 14, y);
  y += 6;
  if (userName) {
    doc.text(`Prepared for: ${userName}`, 14, y);
    y += 6;
  }
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [['Summary', 'Amount']],
    body: summaryBody,
    theme: 'striped',
    headStyles: { fillColor: [1, 51, 43] },
  });

  let cursorY = doc.lastAutoTable.finalY + 12;
  autoTable(doc, {
    startY: cursorY,
    head: [['Cash flow', 'Amount']],
    body: cashFlowBody,
    theme: 'striped',
    headStyles: { fillColor: [1, 51, 43] },
  });

  cursorY = doc.lastAutoTable.finalY + 12;
  for (const { title: tableTitle, body } of tables) {
    if (!body || body.length === 0) continue;
    if (cursorY > 250) {
      doc.addPage();
      cursorY = 20;
    }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(tableTitle, 14, cursorY);
    cursorY += 6;
    doc.setFont('helvetica', 'normal');
    autoTable(doc, {
      startY: cursorY,
      head: [['Category / source', 'Amount']],
      body,
      theme: 'grid',
      headStyles: { fillColor: [1, 51, 43] },
    });
    cursorY = doc.lastAutoTable.finalY + 14;
  }

  doc.save(filename || 'finvalora-report.pdf');
}
