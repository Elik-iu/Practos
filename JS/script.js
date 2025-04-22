let events = loadEvents();

function loadEvents() {
  const savedEvents = localStorage.getItem('events');
  return savedEvents ? JSON.parse(savedEvents) : [];
}

function saveEvents() {
  localStorage.setItem('events', JSON.stringify(events));
}


const elements = {
  homePage: document.getElementById('home-page'),
  editPage: document.getElementById('edit-page'),
  eventsList: document.getElementById('events-list'),
  eventForm: document.getElementById('event-form'),
  formTitle: document.getElementById('form-title'),
  eventIdInput: document.getElementById('event-id'),
  eventTitleInput: document.getElementById('event-title'),
  eventDateInput: document.getElementById('event-date'),
  eventCategoryInput: document.getElementById('event-category'),
  eventDescriptionInput: document.getElementById('event-description'),
  deleteBtn: document.getElementById('delete-btn'),
  addEventBtn: document.getElementById('add-event-btn'),
  cancelBtn: document.getElementById('cancel-btn'),
  categoryFilter: document.getElementById('category-filter'),
  dateSort: document.getElementById('date-sort')
};


function displayEvents() {
  elements.eventsList.innerHTML = '';
  
  const filteredEvents = filterEvents();
  const sortedEvents = sortEvents(filteredEvents);
  
  sortedEvents.forEach(createEventCard);
}

function filterEvents() {
  const category = elements.categoryFilter.value;
  return category === 'all' 
    ? [...events] 
    : events.filter(event => event.category === category);
}

function sortEvents(eventsToSort) {
  const sortBy = elements.dateSort.value;
  return [...eventsToSort].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });
}

function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = event.id;
  
  const categoryInfo = getCategoryInfo(event.category);
  
  card.innerHTML = `
    <h3>${event.title}</h3>
    <p><strong>Дата:</strong> ${formatDate(event.date)}</p>
    <p><strong>Категория:</strong> <span class="category ${categoryInfo.class}">${categoryInfo.name}</span></p>
    ${event.description ? `<p><strong>Описание:</strong> ${event.description}</p>` : ''}
  `;
  
  elements.eventsList.appendChild(card);
}

function getCategoryInfo(category) {
  const categories = {
    work: { class: 'work', name: 'Рабочие' },
    personal: { class: 'personal', name: 'Личные' },
    social: { class: 'social', name: 'Общественные' }
  };
  return categories[category] || categories.work;
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
}


function showHomePage() {
  elements.homePage.style.display = 'block';
  elements.editPage.style.display = 'none';
  displayEvents();
}

function showEditPage(eventId = null) {
  elements.homePage.style.display = 'none';
  elements.editPage.style.display = 'block';
  
  if (eventId) {
    setupEditMode(eventId);
  } else {
    setupAddMode();
  }
}

function setupEditMode(eventId) {
  elements.formTitle.textContent = 'Редактировать событие';
  elements.deleteBtn.style.display = 'block';
  
  const event = events.find(e => e.id === eventId);
  if (event) {
    fillForm(event);
  }
}

function setupAddMode() {
  elements.formTitle.textContent = 'Добавить событие';
  elements.deleteBtn.style.display = 'none';
  elements.eventForm.reset();
  elements.eventIdInput.value = '';
}

function fillForm(event) {
  elements.eventIdInput.value = event.id;
  elements.eventTitleInput.value = event.title;
  elements.eventDateInput.value = event.date;
  elements.eventCategoryInput.value = event.category;
  elements.eventDescriptionInput.value = event.description || '';
}

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========
function setupEventListeners() {
  elements.addEventBtn.addEventListener('click', () => showEditPage());
  elements.cancelBtn.addEventListener('click', showHomePage);
  
  elements.eventsList.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) {
      showEditPage(card.dataset.id);
    }
  });
  
  elements.categoryFilter.addEventListener('change', displayEvents);
  elements.dateSort.addEventListener('change', displayEvents);
  
  elements.eventForm.addEventListener('submit', handleFormSubmit);
  elements.deleteBtn.addEventListener('click', handleDelete);
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const eventData = {
    id: elements.eventIdInput.value || Date.now().toString(),
    title: elements.eventTitleInput.value,
    date: elements.eventDateInput.value,
    category: elements.eventCategoryInput.value,
    description: elements.eventDescriptionInput.value
  };
  
  saveEvent(eventData);
  showHomePage();
}

function saveEvent(eventData) {
  if (eventData.id) {
    const index = events.findIndex(e => e.id === eventData.id);
    if (index !== -1) {
      events[index] = eventData;
    }
  } else {
    events.push(eventData);
  }
  saveEvents();
}

function handleDelete() {
  if (confirm('Вы уверены, что хотите удалить это событие?')) {
    events = events.filter(e => e.id !== elements.eventIdInput.value);
    saveEvents();
    showHomePage();
  }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
setupEventListeners();
showHomePage();