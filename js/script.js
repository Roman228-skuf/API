fetch('js/jasu2025_data.json')
  .then(response => response.json())
  .then(data => {
    const tbody = document.querySelector('#projects-table tbody');
    const departmentFilter = document.getElementById('department-filter');
    const regionFilter = document.getElementById('region-filter');
    const searchInput = document.getElementById('search-input');

    // Зібрати унікальні відділення та області
    const departments = Array.from(new Set(data.map(i => i["Відділення"]).filter(Boolean))).sort();
    const regions = Array.from(new Set(data.map(i => i["Область"]).filter(Boolean))).sort();

    departments.forEach(dep => {
      const opt = document.createElement('option');
      opt.value = dep;
      opt.textContent = dep;
      departmentFilter.appendChild(opt);
    });
    regions.forEach(reg => {
      const opt = document.createElement('option');
      opt.value = reg;
      opt.textContent = reg;
      regionFilter.appendChild(opt);
    });

    function renderTable() {
      const depVal = departmentFilter.value;
      const regVal = regionFilter.value;
      const searchVal = searchInput.value.trim().toLowerCase();

      tbody.innerHTML = '';
      data.forEach(item => {
        if (
          (depVal === '' || item["Відділення"] === depVal) &&
          (regVal === '' || item["Область"] === regVal) &&
          (
            !searchVal ||
            (item["Назва"] && item["Назва"].toLowerCase().includes(searchVal)) ||
            (item["№"] && item["№"].toString().toLowerCase().includes(searchVal)) ||
            (item["Відділення"] && item["Відділення"].toLowerCase().includes(searchVal)) ||
            (item["Область"] && item["Область"].toLowerCase().includes(searchVal))
          )
        ) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item["№"] || ''}</td>
            <td>${item["Назва"] || ''}</td>
            <td>${item["Відділення"] || ''}</td>
            <td>${item["Область"] || ''}</td>
            <td>${item["Детальна інформація"] ? `<a href="${item["Детальна інформація"]}" target="_blank">Натиснути</a>` : ''}</td>
            <td>${item["Віртуальний постер"] ? `<a href="${item["Віртуальний постер"]}" target="_blank">Натиснути</a>` : ''}</td>
          `;
          tbody.appendChild(row);
        }
      });
    }

    departmentFilter.addEventListener('change', renderTable);
    regionFilter.addEventListener('change', renderTable);
    searchInput.addEventListener('input', renderTable);

    renderTable();
  });