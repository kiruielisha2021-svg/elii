// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const jokeText = document.getElementById('jokeText');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const categorySelect = document.getElementById('categorySelect');

// Event Listeners
generateBtn.addEventListener('click', fetchJoke);
copyBtn.addEventListener('click', copyJoke);
categorySelect.addEventListener('change', fetchJoke);

// Fetch Joke from API
async function fetchJoke() {
  const category = categorySelect.value;
  
  // Show loading state
  loadingDiv.classList.add('show');
  errorDiv.classList.remove('show');
  generateBtn.disabled = true;
  jokeText.textContent = '';

  try {
    let apiUrl;
    
    if (category === 'programming') {
      // Programming jokes API
      apiUrl = 'https://official-joke-api.appspot.com/jokes/programming/random';
    } else if (category === 'knock-knock') {
      // Knock-knock jokes API
      apiUrl = 'https://official-joke-api.appspot.com/jokes/knock-knock/random';
    } else {
      // Random joke from any category
      apiUrl = 'https://official-joke-api.appspot.com/random_joke';
    }

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch joke');
    }

    const data = await response.json();
    
    // Format joke text
    let joke = '';
    if (Array.isArray(data)) {
      // If API returns array, get first joke
      joke = `${data[0].setup} ... ${data[0].punchline}`;
    } else if (data.setup && data.punchline) {
      // Standard format with setup and punchline
      joke = `${data.setup} ... ${data.punchline}`;
    } else if (data.joke) {
      // Single line joke
      joke = data.joke;
    }

    jokeText.textContent = joke;
    loadingDiv.classList.remove('show');

  } catch (error) {
    console.error('Error fetching joke:', error);
    errorDiv.textContent = 'Oops! Could not load a joke. Please try again.';
    errorDiv.classList.add('show');
    loadingDiv.classList.remove('show');
  } finally {
    generateBtn.disabled = false;
  }
}

// Copy Joke to Clipboard
function copyJoke() {
  const jokeContent = jokeText.textContent;
  
  if (!jokeContent || jokeContent === 'Click the button to get a random joke!') {
    alert('No joke to copy! Get a joke first.');
    return;
  }

  navigator.clipboard.writeText(jokeContent).then(() => {
    // Visual feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    copyBtn.style.background = '#4caf50';
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = '#f0f0f0';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy joke');
  });
}

// Fetch initial joke on page load
window.addEventListener('load', () => {
  fetchJoke();
});