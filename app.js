/************************
 *  Utility/Storage
 ************************/

// Store user info in localStorage (simulate a real database)
function storeUser(username, password, role) {
    const users = JSON.parse(localStorage.getItem('flashUsers')) || [];
    
    // Check if user already exists
    if (users.some(u => u.username === username)) {
      alert('Username already taken!');
      return false;
    }
  
    // Add new user
    users.push({ username, password, role });
    localStorage.setItem('flashUsers', JSON.stringify(users));
    return true;
  }
  
  function getUser(username) {
    const users = JSON.parse(localStorage.getItem('flashUsers')) || [];
    return users.find(u => u.username === username);
  }
  
  // Save current user session
  function setCurrentUser(username, role) {
    localStorage.setItem('flashCurrentUser', JSON.stringify({ username, role }));
  }
  
  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('flashCurrentUser'));
  }
  
  function clearCurrentUser() {
    localStorage.removeItem('flashCurrentUser');
  }
  
  // Save custom flashcard packs
  function saveFlashcardPack(pack) {
    // pack = {id, name, cards: []}
    const packs = JSON.parse(localStorage.getItem('flashPacks')) || [];
    packs.push(pack);
    localStorage.setItem('flashPacks', JSON.stringify(packs));
  }
  
  // Get all flashcard packs (both premade + custom)
  async function getAllFlashcardPacks() {
    // load premade packs from JSON
    let response = await fetch('data/premade-packs.json');
    let premade = await response.json();
  
    // load custom packs from localStorage
    let custom = JSON.parse(localStorage.getItem('flashPacks')) || [];
    
    return [...premade, ...custom];
  }
  
  /************************
   *  Login / Signup
   ************************/
  window.addEventListener('load', () => {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path === '/' || path === '') {
      // On index page
      initIndexPage();
    } else if (path.endsWith('dashboard.html')) {
      initDashboardPage();
    } else if (path.endsWith('flashcards.html')) {
      initFlashcardsPage();
    }
  });
  
  function initIndexPage() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
  
    loginBtn.addEventListener('click', handleLogin);
    signupBtn.addEventListener('click', handleSignup);
  }
  
  function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
  
    const user = getUser(username);
    if (!user || user.password !== password) {
      alert('Invalid username or password.');
      return;
    }
  
    // Set current user
    setCurrentUser(user.username, user.role);
    // Redirect
    window.location.href = 'dashboard.html';
  }
  
  function handleSignup() {
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const role = document.getElementById('signup-type').value;
  
    if (!username || !password) {
      alert('Please enter username and password.');
      return;
    }
  
    if (storeUser(username, password, role)) {
      // success
      alert('Account created!');
      setCurrentUser(username, role);
      window.location.href = 'dashboard.html';
    }
  }
  
  function initDashboardPage() {
    const user = getCurrentUser();
    if (!user) {
      // not logged in
      window.location.href = 'index.html';
      return;
    }
  
    document.getElementById('logout-btn').addEventListener('click', () => {
      clearCurrentUser();
      window.location.href = 'index.html';
    });
  
    if (user.role === 'student') {
      document.getElementById('student-dashboard').classList.remove('hidden');
      document.getElementById('student-name').innerText = user.username;
      loadStudentProgress();
    } else if (user.role === 'teacher') {
      document.getElementById('teacher-dashboard').classList.remove('hidden');
      document.getElementById('teacher-name').innerText = user.username;
      loadTeacherProgress();
    }
  }
  
  // Very simple “progress” logic for demonstration
  function loadStudentProgress() {
    const progressDiv = document.getElementById('student-progress');
    // For demonstration, just show some placeholder text or localStorage data
    progressDiv.innerHTML = 'You have studied X flashcards so far!';
  }
  
  function loadTeacherProgress() {
    const progressDiv = document.getElementById('teacher-progress');
    // For demonstration, list mock student progress
    progressDiv.innerHTML = `
      <p>Student1: studied 10 flashcards</p>
      <p>Student2: studied 5 flashcards</p>
    `;
  }
  
  /************************
   *  Flashcards Page
   ************************/
  function initIndexPage() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
  
    if (loginBtn) {
      loginBtn.addEventListener('click', handleLogin);
      alert("Login Button clicked")
    } else {
      console.error("Login button not found.");
    }
  
    if (signupBtn) {
      signupBtn.addEventListener('click', handleSignup);
      alert("Signup Button clicked")
    } else {
      console.error("Sign up button not found.");
    }
  }
  
  
  // Display all packs in <ul id="packs-ul">
  async function loadFlashcardPacks() {
    const packs = await getAllFlashcardPacks();
    const ul = document.getElementById('packs-ul');
    ul.innerHTML = '';
  
    packs.forEach(pack => {
      const li = document.createElement('li');
      li.textContent = pack.name;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => startStudy(pack));
      ul.appendChild(li);
    });
  }
  
  // Variables for studying a pack
  let currentPack = null;
  let currentCardIndex = 0;
  
  function startStudy(pack) {
    currentPack = pack;
    currentCardIndex = 0;
  
    document.getElementById('study-pack-name').innerText = pack.name;
    document.getElementById('study-section').classList.remove('hidden');
    showCard();
  }
  
  function showCard() {
    if (!currentPack) return;
    
    const frontDiv = document.getElementById('card-front');
    const backDiv = document.getElementById('card-back');
    const card = currentPack.cards[currentCardIndex];
  
    frontDiv.textContent = card.front;
    backDiv.textContent = card.back;
    backDiv.classList.add('hidden');
  }
  
  // Flip the card
  function flipCard() {
    const backDiv = document.getElementById('card-back');
    backDiv.classList.toggle('hidden');
  }
  
  // Show next card in the pack
  function nextCard() {
    if (!currentPack) return;
    currentCardIndex++;
    if (currentCardIndex >= currentPack.cards.length) {
      currentCardIndex = 0; // loop back or end?
      alert('You finished the pack!');
      // Alternatively, hide the study section or show final message
      return;
    }
    showCard();
  }
  
  /************************
   *  Create New Flashcard Pack
   ************************/
  function addCardCreator() {
    const container = document.getElementById('cards-creator');
    
    const div = document.createElement('div');
    div.classList.add('card-creator');
    div.innerHTML = `
      <input type="text" class="front-input" placeholder="Front" />
      <input type="text" class="back-input" placeholder="Back" />
    `;
    container.appendChild(div);
  }
  
  function saveNewPack() {
    const name = document.getElementById('new-pack-name').value.trim();
    if (!name) {
      alert('Please enter a pack name.');
      return;
    }
  
    // Gather cards from the form
    const container = document.getElementById('cards-creator');
    const cardCreators = container.querySelectorAll('.card-creator');
    const cards = [];
  
    cardCreators.forEach(cc => {
      const front = cc.querySelector('.front-input').value.trim();
      const back = cc.querySelector('.back-input').value.trim();
      if (front && back) {
        cards.push({ front, back });
      }
    });
  
    if (cards.length === 0) {
      alert('No cards to save.');
      return;
    }
  
    const newPack = {
      id: Date.now().toString(),
      name: name,
      cards: cards
    };
    saveFlashcardPack(newPack);
    alert('New pack saved!');
    // Optionally reload the flashcard packs list
    loadFlashcardPacks();
    // Clear input fields
    document.getElementById('new-pack-name').value = '';
    container.innerHTML = `
      <div class="card-creator">
        <input type="text" class="front-input" placeholder="Front" />
        <input type="text" class="back-input" placeholder="Back" />
      </div>
    `;
  }  