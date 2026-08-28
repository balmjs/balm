import getAwesomeMessage from '@/scripts/awesome.js';

console.log('🚀 BalmJS 6.x Playground Loaded with @/ alias!');

const btn = document.getElementById('btn');
const output = document.getElementById('output');

if (btn && output) {
  btn.addEventListener('click', () => {
    output.textContent = getAwesomeMessage();
  });
}
