import os from 'node:os';

const platform = os.platform();

// Get interface name, default is 'eth' on linux, 'en' on mac os.
function getInterfaceName(): string | null {
  let val: string | null = 'eth';

  if (platform === 'darwin') {
    val = 'en';
  } else if (platform === 'win32') {
    val = null;
  }

  return val;
}

function getInterface(family: string): os.NetworkInterfaceInfo | undefined {
  const interfaces: NodeJS.Dict<
    os.NetworkInterfaceInfo[]
  > = os.networkInterfaces();
  const name = getInterfaceName();
  family = family || 'IPv4';

  for (let i = -1; i < 8; i++) {
    const interfaceName = `${name}${i >= 0 ? i : ''}`; // support 'lo' and 'lo0'
    const items = interfaces[interfaceName];
    if (items) {
      for (let j = 0, len = items.length; j < len; j++) {
        const item: os.NetworkInterfaceInfo = items[j];
        if (item.family === family) {
          return item;
        }
      }
    }
  }

  // (no interface name) filter 127.0.0.1, get the first ip
  for (const k in interfaces) {
    const items = interfaces[k];
    if (items) {
      for (let i = 0, len = items.length; i < len; i++) {
        const item: os.NetworkInterfaceInfo = items[i];
        if (item.family === family && item.address !== '127.0.0.1') {
          return item;
        }
      }
    }
  }

  return;
}

/**
 * Get current machine IPv4
 */
function ip(): string | undefined {
  const item: os.NetworkInterfaceInfo | undefined = getInterface('IPv4');

  return item && item.address;
}

export default {
  ip
};
