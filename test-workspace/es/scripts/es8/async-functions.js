const url = 'https://jsonplaceholder.typicode.com/todos/1';

(async function fetchJson() {
  try {
    let request = await fetch(url);
    let text = await request.text();
    let result = JSON.parse(text);
    console.log(result);
  } catch (error) {
    console.log(`ERROR: ${error.stack}`);
  }
})();

console.log('---');
