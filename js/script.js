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
    if (subject === 'all') {
        // Завантажуємо всі предмети
        const files = Object.values(subjectFiles);
        Promise.all(files.map(file => fetch(file).then(r => r.json())))
            .then(allData => {
                // Об'єднуємо всі масиви та фільтруємо тільки ті, що мають title
                cardsData = allData.flat().filter(item => item.title);
                updateRegionFilter();
                renderCards();
            });
    } else {
        fetch(subjectFiles[subject])
            .then(response => response.json())
            .then(data => {
                cardsData = data.filter(item => item.title);
                updateRegionFilter();
                renderCards();
            });
    }
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
                <div class="card-image-preview" style="margin-top:10px;cursor:pointer;color:#007bff;text-decoration:underline;">Показати зображення</div>
            `;
            // Додаємо обробник кліку для показу зображення
            card.querySelector('.card-image-preview').addEventListener('click', () => {
                showImageModal(item.number);
            });
            container.appendChild(card);
        }
    });
}

// Додаємо модальне вікно для зображення
function showImageModal(number) {
    // Збираємо всі можливі картинки для цього номера (наприклад, 1.1, 1.2, ... 1.20)
    const maxImages = 20; // змініть на максимальну кількість, яка може бути для одного номера
    const images = [];
    for (let i = 1; i <= maxImages; i++) {
        images.push(`images/${number}.${i}.jpg`);
    }

    // Перевіряємо, які картинки реально існують
    let loadedImages = [];
    let checked = 0;

    images.forEach((src, idx) => {
        const img = new Image();
        img.onload = () => {
            loadedImages.push(src);
            checked++;
            if (checked === images.length) showModalWithImages(loadedImages, number);
        };
        img.onerror = () => {
            checked++;
            if (checked === images.length) showModalWithImages(loadedImages, number);
        };
        img.src = src;
    });

    function showModalWithImages(imgArr, number) {
        if (imgArr.length === 0) {
            alert('Зображення не знайдено!');
            return;
        }
        let current = 0;

        let modal = document.getElementById('image-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'image-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(0,0,0,0.7)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';
            modal.innerHTML = `
                <div style="position:relative;background:#fff;padding:20px;border-radius:8px;max-width:90vw;max-height:90vh;">
                    <span id="close-modal" style="position:absolute;top:5px;right:10px;cursor:pointer;font-size:24px;">&times;</span>
                    <button id="prev-img" style="position:absolute;left:5px;top:50%;transform:translateY(-50%);font-size:32px;background:none;border:none;cursor:pointer;">&#8592;</button>
                    <img id="modal-img" src="" alt="Зображення" style="max-width:80vw;max-height:80vh;display:block;margin:auto;">
                    <button id="next-img" style="position:absolute;right:5px;top:50%;transform:translateY(-50%);font-size:32px;background:none;border:none;cursor:pointer;">&#8594;</button>
                    <div id="img-counter" style="text-align:center;margin-top:10px;"></div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('#close-modal').onclick = () => {
                modal.style.display = 'none';
            };
            modal.onclick = (e) => {
                if (e.target === modal) modal.style.display = 'none';
            };
        }

        function updateImg() {
            modal.querySelector('#modal-img').src = imgArr[current];
            modal.querySelector('#img-counter').textContent = `Зображення ${current + 1} з ${imgArr.length}`;
        }

        modal.querySelector('#prev-img').onclick = (e) => {
            e.stopPropagation();
            current = (current - 1 + imgArr.length) % imgArr.length;
            updateImg();
        };
        modal.querySelector('#next-img').onclick = (e) => {
            e.stopPropagation();
            current = (current + 1) % imgArr.length;
            updateImg();
        };

        updateImg();
        modal.style.display = 'flex';
    }
}

subjectFilter.addEventListener('change', () => loadData(subjectFilter.value));
regionFilter.addEventListener('change', renderCards);
searchInput.addEventListener('input', renderCards);

// Початкове завантаження
loadData(subjectFilter.value);