document.addEventListener('DOMContentLoaded', init);

const state = {
    currentDate: new Date(),
    selectedDate: new Date(),
    tasks: JSON.parse(localStorage.getItem('glassTodoTasks')) || {},
    theme: localStorage.getItem('glassTodoTheme') || 'light'
};

const DOM = {
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.querySelector('#theme-toggle span'),
    calendarGrid: document.getElementById('calendar-grid'),
    currentMonthYear: document.getElementById('current-month-year'),
    prevMonthBtn: document.getElementById('prev-month'),
    nextMonthBtn: document.getElementById('next-month'),
    selectedDateDisplay: document.getElementById('selected-date-display'),
    taskCount: document.getElementById('task-count'),
    tasksList: document.getElementById('tasks-list'),
    addTaskBtn: document.getElementById('add-task-btn'),
    modal: document.getElementById('task-modal'),
    closeModalBtn: document.getElementById('close-modal'),
    taskForm: document.getElementById('task-form'),
    inputs: {
        title: document.getElementById('task-title'),
        desc: document.getElementById('task-desc'),
        colors: document.getElementsByName('task-color')
    }
};

function init() {
    // Apply Theme
    applyTheme(state.theme);

    // Listeners
    DOM.themeToggle.addEventListener('click', toggleTheme);
    DOM.prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    DOM.nextMonthBtn.addEventListener('click', () => changeMonth(1));
    DOM.addTaskBtn.addEventListener('click', openModal);
    DOM.closeModalBtn.addEventListener('click', closeModal);
    DOM.modal.addEventListener('click', (e) => {
        if (e.target === DOM.modal) closeModal();
    });
    DOM.taskForm.addEventListener('submit', handleTaskSubmit);

    // Initial Render
    renderCalendar();
    selectDate(new Date()); // Select today by default
}

/* Theme Logic */
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('glassTodoTheme', state.theme);
    applyTheme(state.theme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    DOM.themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
}

/* Calendar Logic */
function renderCalendar() {
    const year = state.currentDate.getFullYear();
    const month = state.currentDate.getMonth();

    DOM.currentMonthYear.textContent = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    DOM.calendarGrid.innerHTML = '';

    // Empty cells for days before start of month
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        DOM.calendarGrid.appendChild(emptyDiv);
    }

    // Days of month
    for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = i;

        const dateStr = getFormattedDateKey(new Date(year, month, i));

        // Check for today
        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }

        // Check for selected
        if (dateStr === getFormattedDateKey(state.selectedDate)) {
            dayDiv.classList.add('selected');
        }

        // Check for tasks
        if (state.tasks[dateStr] && state.tasks[dateStr].length > 0) {
            const dot = document.createElement('div');
            dot.classList.add('has-tasks-dot');
            dayDiv.appendChild(dot);
        }

        dayDiv.addEventListener('click', () => selectDate(new Date(year, month, i)));
        DOM.calendarGrid.appendChild(dayDiv);
    }
}

function changeMonth(delta) {
    state.currentDate.setMonth(state.currentDate.getMonth() + delta);
    renderCalendar();
}

function selectDate(date) {
    state.selectedDate = date;

    // Update header display
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    DOM.selectedDateDisplay.textContent = date.toLocaleDateString('en-US', options);

    // Re-render calendar to highlight selected
    renderCalendar();
    // Render tasks for this date
    renderTasks();
}

function getFormattedDateKey(date) {
    // Returns YYYY-MM-DD
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/* Task Logic */
function renderTasks() {
    const dateKey = getFormattedDateKey(state.selectedDate);
    const tasks = state.tasks[dateKey] || [];

    DOM.taskCount.textContent = `${tasks.length} Task${tasks.length !== 1 ? 's' : ''}`;
    DOM.tasksList.innerHTML = '';

    if (tasks.length === 0) {
        DOM.tasksList.innerHTML = `
            <div class="empty-state">
                <span class="material-icons-round">event_note</span>
                <p>No tasks for this day</p>
            </div>
        `;
        return;
    }

    tasks.forEach((task, index) => {
        const isCompleted = task.status === 'completed';
        const statusBadge = isCompleted
            ? `<span class="status-badge completed">Completed</span>`
            : `<span class="status-badge pending">Pending</span>`;

        const card = document.createElement('div');
        card.classList.add('task-card', `color-${task.color}`);
        if (isCompleted) card.classList.add('completed');

        card.innerHTML = `
            <div class="task-info">
                <div class="task-header">
                    <div class="task-title">${task.title}</div>
                    ${statusBadge}
                </div>
                ${task.desc ? `<div class="task-description">${task.desc}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="action-btn ${isCompleted ? 'undo-btn' : 'complete-btn'}" 
                        onclick="toggleTaskStatus(${index})" 
                        title="${isCompleted ? 'Mark as Pending' : 'Mark as Completed'}">
                    <span class="material-icons-round">${isCompleted ? 'undo' : 'check'}</span>
                </button>
                <button class="action-btn delete-btn" onclick="deleteTask(${index})" title="Delete Task">
                    <span class="material-icons-round">delete</span>
                </button>
            </div>
        `;

        // Expand on click (exclude button interaction)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                card.classList.toggle('expanded');
            }
        });

        DOM.tasksList.appendChild(card);
    });
}

function handleTaskSubmit(e) {
    e.preventDefault();

    const title = DOM.inputs.title.value;
    const desc = DOM.inputs.desc.value;
    let color = 'blue';

    for (const radio of DOM.inputs.colors) {
        if (radio.checked) {
            color = radio.value;
            break;
        }
    }

    const newTask = {
        title,
        desc,
        color,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    const dateKey = getFormattedDateKey(state.selectedDate);

    if (!state.tasks[dateKey]) {
        state.tasks[dateKey] = [];
    }
    state.tasks[dateKey].push(newTask);

    // Sort logic removed as time is removed. Maybe sort by status/created?
    // Let's keep them in order of creation (append)

    saveTasks();
    renderTasks();
    renderCalendar(); // To update dots
    closeModal();
    DOM.taskForm.reset();
}

/* Global Scope for Actions (assigned via onclick string) */
window.deleteTask = function (index) {
    const dateKey = getFormattedDateKey(state.selectedDate);
    if (state.tasks[dateKey]) {
        state.tasks[dateKey].splice(index, 1);
        if (state.tasks[dateKey].length === 0) {
            delete state.tasks[dateKey];
        }
        saveTasks();
        renderTasks();
        renderCalendar();
    }
};

window.toggleTaskStatus = function (index) {
    const dateKey = getFormattedDateKey(state.selectedDate);
    if (state.tasks[dateKey] && state.tasks[dateKey][index]) {
        const task = state.tasks[dateKey][index];
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        saveTasks();
        renderTasks();
    }
};

function saveTasks() {
    localStorage.setItem('glassTodoTasks', JSON.stringify(state.tasks));
}

/* Modal Logic */
function openModal() {
    DOM.modal.classList.add('active');
    DOM.inputs.title.focus();
}

function closeModal() {
    DOM.modal.classList.remove('active');
}
