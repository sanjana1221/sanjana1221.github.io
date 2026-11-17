function orNotListed(value) {
  return value === "------" || value === "N/A" || value === undefined
    ? "Not listed"
    : value;
}
function countBy(data, field) {
  const counts = {};
  data.forEach((item) => {
    const key = orNotListed(item[field]);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function largest(counts) {
  return Object.keys(counts).reduce((best, label) =>
    counts[label] > counts[best] ? label : best,
  );
}
function showCharts(data) {
  // The text alternative for each chart, worked out from the data
  const typeCounts = countBy(data, "category");
  const topType = largest(typeCounts);
  const resultCounts = countBy(data, "inspection_results");
  const topResult = largest(resultCounts);

  /*html*/
  return `
                <h2 class="view-title"> Charts View</h2>
                <p class="view-description">Patterns in the data at a glance</p>
                <div class="charts-grid">
                    <figure class="chart-figure">
                        <canvas id="chart-one"></canvas>
                        <figcaption class="chart-summary">${topType} had the most inspections: ${typeCounts[topType]} of ${data.length}.</figcaption>
                    </figure>
                    <figure class="chart-figure">
                        <canvas id="chart-two"></canvas>
                        <figcaption class="chart-summary">The most common inspection result was "${topResult}": ${resultCounts[topResult]} of ${data.length} inspections.</figcaption>
                    </figure>
                </div>
            `;
}

function drawCharts(data) {
  // Chart.js is loaded by a <script> tag in index.html. If it didn't load, say so instead of breaking.
  if (typeof Chart === "undefined") {
    document.querySelector(".charts-grid").innerHTML =
      '<p class="error">Chart.js did not load, so the charts can\'t be drawn. Check the &lt;script&gt; tag in index.html.</p>';
    return;
  }
  // Chart 1: inspections by type of business (bar chart)
  const typeCounts = countBy(data, "category");
  const typeLabels = Object.keys(typeCounts);
  const typeNumbers = Object.values(typeCounts);

  new Chart(document.querySelector("#chart-one"), {
    type: "bar",
    data: {
      labels: typeLabels,
      datasets: [{ label: "Number of inspections", data: typeNumbers }],
    },
    options: {
      plugins: {
        title: { display: true, text: "Inspections by type of business" },
      },
      scales: {
        x: { title: { display: true, text: "Type of business" } },
        y: { title: { display: true, text: "Inspections" }, beginAtZero: true },
      },
    },
  });
  // Chart 2: how the inspections ended (pie chart)
  const resultCounts = countBy(data, "inspection_results");
  const resultLabels = Object.keys(resultCounts);
  const resultNumbers = Object.values(resultCounts);

  new Chart(document.querySelector("#chart-two"), {
    type: "pie",
    data: {
      labels: resultLabels,
      datasets: [{ label: "Inspections", data: resultNumbers }],
    },
    options: {
      plugins: {
        title: { display: true, text: "Inspection results" },
        legend: { position: "bottom" },
      },
    },
  });
}

export { showCharts, drawCharts };
