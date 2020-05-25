const SERVICE_WORKER_API = 'serviceWorker';
const SERVICE_WORKER_FILE_PATH = '/sw.js';
const isSupportServiceWorker = SERVICE_WORKER_API in navigator;

const sendMessageToSW = (msg) =>
  // This wraps the message posting/response in a promise, which will resolve if the response doesn't
  // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
  // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
  // a convenient wrapper.
  new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    // This sends the message data as well as transferring messageChannel.port2 to the service worker.
    // The service worker can then use the transferred port to reply via postMessage(), which
    // will in turn trigger the onmessage handler on messageChannel.port1.
    // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    navigator.serviceWorker.controller &&
      navigator.serviceWorker.controller.postMessage(msg, [
        messageChannel.port2
      ]);
  });

if (isSupportServiceWorker) {
  navigator.serviceWorker
    .register(SERVICE_WORKER_FILE_PATH)
    .then(() => console.log('Load service worker success'))
    .catch(() => console.error('Load service worker fail'))
    .then(() => sendMessageToSW('Hello, BalmJS for Service Worker.'))
    .then(console.log)
    .catch(() => console.error('Send message error.'));
} else {
  console.info('Browser not support Service Worker.');
}
