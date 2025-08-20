// Simple but effective API obfuscation
const simpleEncode = (str) => {
  return str.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 3)).join('');
};

const simpleDecode = (str) => {
  return str.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 3)).join('');
};

// Obfuscated endpoints
const endpoints = {
  api: simpleDecode('dsl'),
  groups: simpleDecode('jurxsv'),
  attendance: simpleDecode('dwwhqgdqfh')
};

// Dynamic URL construction
const buildUrl = (...parts) => {
  const base = `${window.location.protocol}//${window.location.hostname}${window.location.hostname === 'localhost' ? ':3001' : ''}`;
  return parts.reduce((url, part) => `${url}/${encodeURIComponent(part)}`, base);
};

// Secure request wrapper
const secureRequest = async (path, options = {}) => {
  const url = buildUrl(endpoints.api, path);
  
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body,
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  
  return response.json();
};

export { secureRequest, endpoints };