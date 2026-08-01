// ---- DOM References ----
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const upperCheck = document.getElementById('upper');
const lowerCheck = document.getElementById('lower');
const numberCheck = document.getElementById('number');
const symbolCheck = document.getElementById('symbol');
const generateBtn = document.getElementById('generateBtn');
const passwordEl = document.getElementById('password');
const copyBtn = document.getElementById('copyBtn');
const copyMsg = document.getElementById('copyMsg');
const strengthLabel = document.getElementById('strengthLabel');
const fill = document.getElementById('fill');

// ---- Character Sets ----
const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*'
};

// ---- Update slider track fill ----
function updateSliderTrack() {
  const val = lengthSlider.value;
  const min = +lengthSlider.min;
  const max = +lengthSlider.max;
  const pct = ((val - min) / (max - min)) * 100;
  lengthSlider.style.background = `linear-gradient(to right, var(--purple) 0%, var(--purple) ${pct}%, var(--bg-tertiary) ${pct}%, var(--bg-tertiary) 100%)`;
}

// ---- Generate Password ----
function generatePassword() {
  const length = +lengthSlider.value;
  const sets = [];

  if (upperCheck.checked) sets.push(CHARS.upper);
  if (lowerCheck.checked) sets.push(CHARS.lower);
  if (numberCheck.checked) sets.push(CHARS.number);
  if (symbolCheck.checked) sets.push(CHARS.symbol);

  // If nothing selected, default to lowercase (without altering checkbox)
  if (sets.length === 0) {
    sets.push(CHARS.lower);
  }

  const allChars = sets.join('');
  let password = '';

  // Guarantee at least one char from each selected set
  for (const set of sets) {
    password += set[Math.floor(Math.random() * set.length)];
  }

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password (Fisher-Yates)
  const arr = password.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.join('');
}

// ---- Strength Calculation ----
function calcStrength(pwd) {
  let score = 0;

  if (pwd.length >= 12) score += 2;
  else if (pwd.length >= 8) score += 1;

  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 2;
  else if (/[a-z]/.test(pwd) || /[A-Z]/.test(pwd)) score += 1;

  if (/\d/.test(pwd)) score += 1;

  if (/[^a-zA-Z0-9]/.test(pwd)) score += 2;

  if (pwd.length >= 16) score += 1;

  return score;
}

function updateStrength(pwd) {
  const score = calcStrength(pwd);

  let label, percent, color;

  if (score >= 7) {
    label = 'Strong';
    percent = 100;
    color = 'linear-gradient(90deg,#22c55e,#4ade80)';
  } else if (score >= 4) {
    label = 'Medium';
    percent = 60;
    color = 'linear-gradient(90deg,#eab308,#facc15)';
  } else {
    label = 'Weak';
    percent = 30;
    color = 'linear-gradient(90deg,#ef4444,#f87171)';
  }

  strengthLabel.textContent = label;
  fill.style.width = percent + '%';
  fill.className = 'strength-fill ' + label.toLowerCase();
  strengthLabel.className = 'strength-label ' + label.toLowerCase();
}

// ---- Copy to Clipboard ----
async function copyPassword() {
  const text = passwordEl.textContent;
  if (!text || text === 'Click generate to start') return;

  try {
    await navigator.clipboard.writeText(text);
    copyMsg.textContent = '✓ Copied!';
    setTimeout(() => { copyMsg.textContent = ''; }, 2000);
  } catch {
    copyMsg.textContent = '✗ Could not copy';
    setTimeout(() => { copyMsg.textContent = ''; }, 2000);
  }
}

// ---- Update UI ----
function updateUI() {
  const pwd = generatePassword();
  passwordEl.textContent = pwd;
  updateStrength(pwd);
}

// ---- Event Listeners ----
lengthSlider.addEventListener('input', () => {
  lengthValue.textContent = lengthSlider.value;
  updateSliderTrack();
});

generateBtn.addEventListener('click', updateUI);
copyBtn.addEventListener('click', copyPassword);

// ---- "Generate Another" Button ----
const againBtn = document.getElementById('againBtn');
if (againBtn) {
  againBtn.addEventListener('click', updateUI);
}

// ---- Init ----
updateSliderTrack();
updateUI();
