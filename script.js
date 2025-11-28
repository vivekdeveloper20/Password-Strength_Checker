const password = document.getElementById('password');
const toggle = document.getElementById('toggle');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');
const crackTime = document.getElementById('crack-time');
const review = document.getElementById('review');

const len = document.getElementById('len');
const upper = document.getElementById('upper');
const lower = document.getElementById('lower');
const number = document.getElementById('number');
const symbol = document.getElementById('symbol');

function secondsToReadableTime(seconds) {
  const years = seconds / (60 * 60 * 24 * 365);
  if (years >= 1) return `${years.toFixed(1)} year${years > 1 ? 's' : ''}`;
  const minutes = seconds / 60;
  if (minutes >= 1) return `${minutes.toFixed(1)} minute${minutes > 1 ? 's' : ''}`;
  return `${seconds.toFixed(1)} second${seconds > 1 ? 's' : ''}`;
}

toggle.addEventListener('change', () => {
  password.type = toggle.checked ? "text" : "password";
});

password.addEventListener('input', () => {
  const val = password.value;
  const result = zxcvbn(val);
  const score = result.score;

  const widths = ["0%", "25%", "50%", "75%", "100%"];
  const colors = ["#f85149", "#f0883e", "#f2cc60", "#2ea043", "#00c896"];
  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  strengthFill.style.width = widths[score];
  strengthFill.style.backgroundColor = colors[score];
  strengthText.textContent = val ? `Strength: ${labels[score]}` : "";

  const seconds = result.crack_times_seconds.offline_slow_hashing_1e4_per_second;
  crackTime.textContent = val ? secondsToReadableTime(seconds) : "-";

  const warning = result.feedback.warning || "";
  const suggestions = result.feedback.suggestions.join(', ');
  review.textContent = val
    ? warning
      ? `“${warning}” — Watch out, we see that a lot. Try changing it. ${suggestions}`
      : suggestions
    : "-";

  len.textContent = val.length >= 8 ? "✅ 8+ characters" : "❌ 8+ characters";
  upper.textContent = /[A-Z]/.test(val) ? "✅ Uppercase" : "❌ Uppercase";
  lower.textContent = /[a-z]/.test(val) ? "✅ Lowercase" : "❌ Lowercase";
  number.textContent = /\d/.test(val) ? "✅ Number" : "❌ Number";
  symbol.textContent = /[^\w\s]/.test(val) ? "✅ Symbol" : "❌ Symbol";
});
