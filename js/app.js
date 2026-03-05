async function fetchCSV(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`No se pudo cargar ${path}: ${res.status}`);
  const text = await res.text();
  return parseSimpleCSV(text);
}

// CSV sencillo: una fila por línea, separador coma, valores opcionalmente entre comillas
function parseSimpleCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = splitCSVLine(lines[0]).map(h => stripQuotes(h));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = splitCSVLine(lines[i]).map(c => stripQuotes(c));
    const row = {};
    headers.forEach((h, idx) => row[h] = (cols[idx] ?? "").trim());
    rows.push(row);
  }
  return rows;
}

function stripQuotes(s) {
  return s.replace(/^"(.*)"$/, "$1");
}

// Buscamos el objeto que tiene el mayor número de unidades
const productoTop = filtrado.reduce((prev, current) => {
    return (prev.UNIDADES_VEN > current.UNIDADES_VEN) ? prev : current;
});

// Lo pintamos en el HTML
document.getElementById('kpiMaxVenta').innerText = productoTop.PRODUCTO;

// Parte la línea respetando comillas
function splitCSVLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === "," && !inQuotes) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}
