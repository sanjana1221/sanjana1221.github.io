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

function showTable(data) {
  return `
                <h2 class="view-title">Table View</h2>
                <p class="view-description">Scan specific information across all inspections</p>
                <div class="table-scroll">
                <table class="inspection-table">
                    <caption>Food safety inspections in Prince George's County</caption>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Address</th>
                            <th>Inspected</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data
                          .map(
                            (inspection) => `
                            <tr>
                                <td>${inspection.name}</td>
                                <td>${orNotListed(inspection.category)}</td>
                                <td>${inspection.address_line_1}, ${inspection.city}</td>
                                <td>${formatDate(inspection.inspection_date)}</td>
                                <td>${orNotListed(inspection.inspection_results)}</td>
                                
                                

                                
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
                </div>
            `;
}

export default showTable;
