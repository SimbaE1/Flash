// Set user type in localStorage
document.getElementById('select-student')?.addEventListener('click', () => {
  localStorage.setItem('userType', 'student');
  localStorage.setItem('userName', 'Student');
  window.location.href = 'dashboard.html';
});

document.getElementById('select-teacher')?.addEventListener('click', () => {
  localStorage.setItem('userType', 'teacher');
  localStorage.setItem('userName', 'Teacher');
  window.location.href = 'dashboard.html';
});

// Populate dashboard
if (window.location.pathname.includes('dashboard.html')) {
  const userName = localStorage.getItem('userName');
  const userType = localStorage.getItem('userType');
  if (!userName || !userType) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('user-name').textContent = userName;
    // Logic to display progress or other features
  }
}

// Flashcard functionality
if (window.location.pathname.includes('flashcards.html')) {
  const flashcardPacks = JSON.parse(localStorage.getItem('flashcardPacks') || '[]');

  // Populate packs list
  const packsUl = document.getElementById('packs-ul');
  flashcardPacks.forEach(pack => {
    const li = document.createElement('li');
    li.textContent = pack.name;
    packsUl.appendChild(li);
  });
}

// Logout functionality
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});