// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
  // Role selection buttons
  const studentButton = document.getElementById('select-student');
  const teacherButton = document.getElementById('select-teacher');

  // Add event listeners for role selection
  if (studentButton) {
    studentButton.addEventListener('click', () => {
      localStorage.setItem('userType', 'student');
      localStorage.setItem('userName', 'Student');
      window.location.href = 'dashboard.html';
    });
  }

  if (teacherButton) {
    teacherButton.addEventListener('click', () => {
      localStorage.setItem('userType', 'teacher');
      localStorage.setItem('userName', 'Teacher');
      window.location.href = 'dashboard.html';
    });
  }

  // Dashboard logic
  if (window.location.pathname.includes('dashboard.html')) {
    const userName = localStorage.getItem('userName');
    const userType = localStorage.getItem('userType');

    // Redirect to index if user info is missing
    if (!userName || !userType) {
      window.location.href = 'index.html';
    } else {
      document.getElementById('user-name').textContent = userName;
    }
  }

  // Logout functionality
  const logoutButton = document.getElementById('logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }
});