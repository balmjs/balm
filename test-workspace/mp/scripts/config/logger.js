export default function logInit() {
  window.onerror = (message, source, lineno, colno, error) => {
    console.log('window.onerror => ', message, source, lineno, colno, error);
  };
  window.addEventListener('error', (evt) =>
    console.log("window.addEventListener('error') =>", evt)
  );
}
