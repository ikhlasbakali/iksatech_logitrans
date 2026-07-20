const escapeCsv = (value) => {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (/[",\n;]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const downloadCsv = (filename, rows, headers) => {
  if (!rows || rows.length === 0) {
    return;
  }

  const isObjectRows = typeof rows[0] === "object" && !Array.isArray(rows[0]);
  const resolvedHeaders = headers || (isObjectRows ? Object.keys(rows[0]) : []);
  const lines = [];

  if (resolvedHeaders.length > 0) {
    lines.push(resolvedHeaders.map(escapeCsv).join(";"));
  }

  rows.forEach((row) => {
    if (isObjectRows) {
      lines.push(resolvedHeaders.map((key) => escapeCsv(row[key])).join(";"));
      return;
    }
    lines.push(row.map(escapeCsv).join(";"));
  });

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const downloadPdf = ({ title, sections }) => {
  const win = window.open("", "_blank");
  if (!win) return;

  const sectionHtml = sections
    .map((section) => {
      const headerRow = section.columns
        .map((col) => `<th>${col}</th>`)
        .join("");
      const bodyRows = section.rows
        .map(
          (row) =>
            `<tr>${section.columns
              .map((col) => `<td>${row[col] ?? ""}</td>`)
              .join("")}</tr>`
        )
        .join("");
      return `
        <section>
          <h2>${section.title}</h2>
          <table>
            <thead><tr>${headerRow}</tr></thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </section>
      `;
    })
    .join("");

  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #0f172a; padding: 24px; }
          h1 { margin: 0 0 16px; font-size: 22px; }
          h2 { margin: 20px 0 8px; font-size: 16px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          th, td { border: 1px solid #e2e8f0; padding: 6px 8px; font-size: 12px; text-align: left; }
          th { background: #f1f5f9; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${sectionHtml}
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
  win.close();
};
