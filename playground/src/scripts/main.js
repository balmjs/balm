const btn = document.getElementById('btn');
const output = document.getElementById('output');

if (btn && output) {
  let count = 0;
  btn.addEventListener('click', () => {
    count++;
    output.textContent = `Button clicked ${count} times! (Balm 6.x reactive build)`;
  });
}
