import fs from 'fs';
import imageminGifsicle from 'imagemin-gifsicle';

(async () => {
  try {
    const input = fs.readFileSync('test-workspace/src/images/logo.gif');
    const result = await imageminGifsicle()(input);
    console.log('Success! Optimized size:', result.length);
  } catch (err) {
    console.error('Error:', err);
  }
})();
