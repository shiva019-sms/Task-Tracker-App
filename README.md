# Task Tracker Web Application

This web application serves as a personal task organizer, enabling users to efficiently manage their daily schedules and to-do lists. Its primary functions include adding new tasks with descriptions and color categories, marking tasks as pending or completed, and deleting unwanted entries. The integrated interactive calendar allows for date-specific task organization, providing a clear overview of upcoming and past activities. All data is persistently stored locally within the user's browser, ensuring that tasks are preserved across sessions without the need for a backend server or complex setup.

## Use Cases

- **Personal Productivity:** Individuals can use it to keep track of personal errands, appointments, and daily goals.
- **Study Planner:** Students can organize assignments, deadlines, and study sessions by date.
- **Project Management:** Small teams or individuals can manage project milestones and tasks in a simple, visual manner.
- **Habit Tracking:** Users can set daily or weekly recurring tasks to build and monitor habits.

## Technology Stack

The application is built using a minimalist and performant technology stack:

- **HTML5:** For structuring the content and semantics of the web pages.
- **CSS3:** Leveraged for styling, including the glassmorphism effects, responsive design, and theme management (light/dark modes).
- **JavaScript (Vanilla JS):** Powers all interactive elements, dynamic content updates, task management logic, calendar functionality, and local data persistence.

## Features

- **🎨 Modern Design**: Glassmorphism UI with vibrant animated backgrounds and smooth transitions.
- **📅 Dynamic Calendar**: Interactive calendar view that allows you to manage tasks date-wise.
- **✅ Task Management**: 
  - Add tasks with title, description, and color categories.
  - Mark tasks as **Pending** or **Completed**.
  - Delete unwanted tasks.
- **🌓 Theme System**: Fully supported Light and Dark modes.
- **💾 Persistence**: All data is saved locally in your browser, so you never lose your tasks.

## Getting Started

### Prerequisites
You strictly need a modern web browser (Chrome, Edge, Firefox, Safari). No server or installation is required.

### Installation
1. Clone this repository or download the source files.
2. Ensure you have the following files in the same directory:
    - `index.html`
    - `styles.css`
    - `script.js`
3. Open `index.html` in your web browser.

## key Controls
- **Theme Toggle**: Click the Moon/Sun icon in the top right header to switch themes.
- **Add Task**: Select a date on the calendar (defaults to today) and click the **+ New** button.
- **Complete Task**: Click the **Check** icon on a task to mark it as done.
- **Undo**: Click the **Undo** icon on a completed task to revert it to pending.
- **Delete**: Click the **Trash** icon to permanently remove a task.

## Technologies Used
- HTML5
- CSS3 (Variables, Flexbox, Grid, Backdrop-Filter)
- JavaScript (ES6+, LocalStorage)
- [Google Fonts (Outfit)](https://fonts.google.com/specimen/Outfit)
- [Material Icons](https://fonts.google.com/icons)

## License
This project is open source and available for personal and educational use.

