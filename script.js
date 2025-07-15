const dates = [
  "2025-07-15", "2025-07-31",
  "2025-08-15", "2025-08-31",
  "2025-09-15", "2025-09-30",
  "2025-10-15", "2025-10-31",
  "2025-11-15", "2025-11-30",
  "2025-12-15", "2025-12-31"
];

const baseline = [
  117000, 119000,
  121000, 123000,
  125000, 128000,
  130000, 132000,
  135000, 138000,
  140000, 142000
];

const optimistic = [
  121000, 124000,
  127000, 130000,
  135000, 140000,
  148000, 152000,
  158000, 165000,
  170000, 178000
];

const pessimistic = [
  112000, 111000,
  113000, 114000,
  117000, 118000,
  120000, 121000,
  123000, 124000,
  125000, 127000
];

// Prawdopodobieństwa: bazowy, optymistyczny, pesymistyczny
const probabilities = [
  [0.55, 0.25, 0.20],
  [0.55, 0.25, 0.20],
  [0.55, 0.25, 0.20],
  [0.55, 0.25, 0.20],
  [0.50, 0.30, 0.20],
  [0.50, 0.30, 0.20],
  [0.45, 0.35, 0.20],
  [0.45, 0.35, 0.20],
  [0.45, 0.35, 0.20],
  [0.45, 0.35, 0.20],
  [0.45, 0.35, 0.20],
  [0.45, 0.35, 0.20]
];

// Obliczanie średniej ważonej
const weighted = dates.map((_, i) =>
  baseline[i] * probabilities[i][0] +
  optimistic[i] * probabilities[i][1] +
  pessimistic[i] * probabilities[i][2]
);

// Formatowanie daty do bardziej czytelnej formy "15 lipca"
function formatDatePol(dateStr) {
  const monthNames = [
    "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
    "lipca", "sierpnia", "września", "października", "listopada", "grudnia"
  ];
  const d = new Date(dateStr);
  return d.getDate() + " " + monthNames[d.getMonth()];
}

// Pobranie aktualnej ceny BTC z CoinGecko
async function fetchCurrentPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await res.json();
    return data.bitcoin.usd;
  } catch (e) {
    console.error("Błąd pobierania ceny BTC:", e);
    return null;
  }
}

// Rysowanie wykresu Plotly
async function drawChart() {
  const currentPrice = await fetchCurrentPrice();

  document.getElementById("current-info").textContent =
    `Aktualna data: ${new Date().toLocaleDateString()} | Cena BTC: ${currentPrice ? currentPrice.toLocaleString('pl-PL', {style:'currency', currency:'USD'}) : 'brak danych'}`;

  const traceBaseline = {
    x: dates,
    y: baseline,
    mode: "lines+markers",
    name: "Scenariusz bazowy",
    line: { color: "rgba(0,191,255,0.6)" },
    hovertemplate: '%{x|%d %B}: %{y}$<extra></extra>'
  };

  const traceOptimistic = {
    x: dates,
    y: optimistic,
    mode: "lines+markers",
    name: "Scenariusz optymistyczny",
    line: { color: "rgba(50,205,50,0.6)" },
    hovertemplate: '%{x|%d %B}: %{y}$<extra></extra>'
  };

  const tracePessimistic = {
    x: dates,
    y: pessimistic,
    mode: "lines+markers",
    name: "Scenariusz pesymistyczny",
    line: { color: "rgba(255,165,0,0.6)" },
    hovertemplate: '%{x|%d %B}: %{y}$<extra></extra>'
  };

  const traceWeighted = {
    x: dates,
    y: weighted,
    mode: "lines+markers",
    name: "Prognoza uśredniona z uwzględnieniem zmiennego w czasie prawdopodobieństwa scenariuszy",
    line: { color: "rgba(0,0,0,0.3)", width: 6 },
    hovertemplate: '%{x|%d %B}: %{y}$<extra></extra>'
  };

  const layout = {
    margin: { t: 60, b: 50, l: 60, r: 30 },
    xaxis: {
      title: "Data",
      tickformat: "%d %b",
      tickvals: dates,
      ticktext: dates.map(formatDatePol)
    },
    yaxis: {
      title: "Cena BTC (USD)",
      tickformat: "$,.0f"
    },
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: 1.1,
      xanchor: "center",
      x: 0.5
    },
    template: "plotly_white"
  };

  Plotly.newPlot("chart", [traceBaseline, traceOptimistic, tracePessimistic, traceWeighted], layout, {responsive: true});
}

drawChart();
