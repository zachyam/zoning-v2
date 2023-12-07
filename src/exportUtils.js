import { cloneElement } from 'react';

export async function exportToPdf(
  gridElement,
  fileName
) {
  const [{ jsPDF }, autoTable, { head, body, foot }] = await Promise.all([
    import('jspdf'),
    (await import('jspdf-autotable')).default,
    await getGridContent(gridElement)
  ]);
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'px'
  });

  autoTable(doc, {
    head,
    body,
    foot,
    horizontalPageBreak: true,
    styles: { cellPadding: 1.5, fontSize: 8, cellWidth: 'wrap' },
    tableWidth: 'wrap'
  });
  doc.save(fileName);
}

async function getGridContent(gridElement) {
  const { renderToStaticMarkup } = await import('react-dom/server');
  const grid = document.createElement('div');
  console.log(gridElement.props.getRows)
  grid.innerHTML = renderToStaticMarkup(
    cloneElement(gridElement, {
      enableVirtualization: false
    })
  );

  return {
    head: getRows('.rdg-header-row'),
    body: getRows('.rdg-row')
  };

  function getRows(selector) {
    return Array.from(grid.querySelectorAll<HTMLDivElement>(selector)).map((gridRow) => {
      return Array.from(gridRow.querySelectorAll<HTMLDivElement>('.rdg-cell')).map(
        (gridCell) => gridCell.innerText
      );
    });
  }
}