function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function orNotListed(value) {
  return value === "------" || value === "N/A" || value === undefined
    ? "Not listed"
    : value;
}
function countFailedChecks(inspection) {
  return Object.values(inspection).filter(
    (value) => value === "Out of Compliance",
  ).length;
}

function showCategories(data) {
  // Requirements:
  // - Group data by one meaningful field (category, city, inspection result, etc.)
  // - Show how many records are in each group, plus one other number per group
  //   (an average, a highest, a lowest)
  // - Show items within each group
  // - Make the groups easy to compare, and visually distinct from their items

  // Group the inspections by their result
  const groups = {};
  data.forEach((inspection) => {
    const result = orNotListed(inspection.inspection_results);
    if (!groups[result]) {
      groups[result] = [];
    }
    groups[result].push(inspection);
  });

  // Biggest groups first, so they are easy to compare
  const sortedResults = Object.keys(groups).sort(
    (a, b) => groups[b].length - groups[a].length,
  );

  const sectionsHTML = sortedResults
    .map((result) => {
      const items = groups[result];

      // The second number: average failed checks per inspection in this group
      const totalFailed = items.reduce(
        (sum, inspection) => sum + countFailedChecks(inspection),
        0,
      );
      const averageFailed = (totalFailed / items.length).toFixed(1);

      const itemsHTML = items
        .map(
          (inspection) => `
            <div class="category-item">
              <span><strong>${orNotListed(inspection.name)}</strong>, ${orNotListed(inspection.city)}</span>
              <span>${formatDate(inspection.inspection_date)}</span>
            </div>
          `,
        )
        .join("");

      return `
        <section class="category-section">
          <h3 class="category-header">
            ${result}: ${items.length} inspections, ${averageFailed} failed checks on average
          </h3>
          <div class="category-items">
            ${itemsHTML}
          </div>
        </section>
      `;
    })
    .join("");

  /*html*/
  return `
    <h2 class="view-title">Category View</h2>
    <p class="view-description">How inspections ended, and how many safety checks failed in each group</p>
    ${sectionsHTML}
  `;
}

export default showCategories;
