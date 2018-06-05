import * as http from 'axios';
import bus from '../store/bus';

const callback = ({ code, data, message }) => {
  let result = {
    success: false,
    data,
    message
  };

  if (code === 200) {
    result.success = true;
  } else {
    // You need BalmUI Lite (https://mdl.balmjs.com)
    if (bus.$alert) {
      // For desktop
      bus.$alert(message);
    } else if (bus.$toast) {
      // For mobile
      bus.$toast(message);
    } else {
      alert(message);
    }
  }

  return result;
};

export { http, bus, callback };
