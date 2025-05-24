const subjectFiles = {
    math: 'js/math.json',
    Economika: 'js/Economika.json',
    PsycistAndSpace: 'js/PsycistAndSpace.json'
};

const subjectFilter = document.getElementById('subject-filter-cards');
const regionFilter = document.getElementById('region-filter-cards');
const searchInput = document.getElementById('search-input-cards');
const container = document.getElementById('cards-container');

let cardsData = [];

function loadData(subject) {
    fetch(subjectFiles[subject])
        .then(response => response.json())
        .then(data => {
            cardsData = data.filter(item => item.title);
            updateRegionFilter();
            renderCards();
        });
}

function updateRegionFilter() {
    const regions = Array.from(new Set(cardsData.map(i => i.region).filter(Boolean))).sort();
    regionFilter.innerHTML = '<option value="">Всі</option>';
    regions.forEach(reg => {
        const opt = document.createElement('option');
        opt.value = reg;
        opt.textContent = reg;
        regionFilter.appendChild(opt);
    });
}

function renderCards() {
    const regVal = regionFilter.value;
    const searchVal = searchInput.value.trim().toLowerCase();
    container.innerHTML = '';
    cardsData.forEach(item => {
        if (
            (regVal === '' || item.region === regVal) &&
            (
                !searchVal ||
                (item.title && item.title.toLowerCase().includes(searchVal)) ||
                (item.region && item.region.toLowerCase().includes(searchVal)) ||
                (item.number && item.number.toString().includes(searchVal))
            )
        ) {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="card-number">№${item.number || ''}</div>
                <div class="card-title">${item.title || ''}</div>
                <div class="card-region"><b>Область:</b> ${item.region || ''}</div>
                <div class="card-class"><b>Клас/Курс:</b> ${item.class || ''}</div>
                <div class="card-section"><b>Секція:</b> ${item.section || ''}</div>
                <div class="card-score"><b>Сума балів:</b> ${item.totalScore || ''}</div>
                <div class="card-rating"><b>Рейтинг:</b> ${item.rating || ''}</div>
                <div class="card-place"><b>Місце:</b> ${item.place !== 0 ? item.place : '-'}</div>
            `;
            container.appendChild(card);
        }
    });
}

subjectFilter.addEventListener('change', () => loadData(subjectFilter.value));
regionFilter.addEventListener('change', renderCards);
searchInput.addEventListener('input', renderCards);

// Початкове завантаження
loadData(subjectFilter.value);