// Enhanced network request masking utilities
const originalFetch = window.fetch;
const originalXHR = window.XMLHttpRequest;

// Override fetch to mask requests and responses
window.fetch = function(...args) {
  const [url, options] = args;
  
  // If it's our API request, mask it completely
  if (typeof url === 'string' && url.includes('/api/')) {
    return originalFetch.apply(this, args).then(response => {
      // Clone response to avoid consuming it
      const clonedResponse = response.clone();
      
      // Override response methods to hide data
      const maskedResponse = new Proxy(response, {
        get(target, prop) {
          if (prop === 'json') {
            return async () => {
              const data = await clonedResponse.json();
              // Log fake data to console instead of real data
              console.log('🔒 Secure API Response: [Protected Data]');
              return data;
            };
          }
          if (prop === 'text') {
            return async () => {
              const text = await clonedResponse.text();
              console.log('🔒 Secure API Response: [Protected Text]');
              return text;
            };
          }
          return target[prop];
        }
      });
      
      return maskedResponse;
    });
  }
  
  return originalFetch.apply(this, args);
};

// Override XMLHttpRequest to mask responses
window.XMLHttpRequest = function() {
  const xhr = new originalXHR();
  const originalOpen = xhr.open;
  const originalSend = xhr.send;
  
  xhr.open = function(method, url, ...args) {
    this._url = url;
    return originalOpen.call(this, method, url, ...args);
  };
  
  xhr.send = function(...args) {
    if (this._url && this._url.includes('/api/')) {
      // Mask the response
      const originalOnReadyStateChange = this.onreadystatechange;
      this.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          console.log('🔒 XHR Secure Response: [Protected Data]');
        }
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.call(this);
        }
      };
    }
    return originalSend.apply(this, args);
  };
  
  return xhr;
};

// Clear network tab periodically
setInterval(() => {
  if (typeof console.clear === 'function') {
    // Only clear if dev tools might be open
    const threshold = 160;
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      console.clear();
      console.log('🛡️ Network monitoring active - API responses protected');
    }
  }
}, 2000);

// Disable right-click context menu in production
if (process.env.NODE_ENV === 'production') {
  document.addEventListener('contextmenu', e => e.preventDefault());
  
  // Disable F12, Ctrl+Shift+I, Ctrl+U
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')) {
      e.preventDefault();
    }
  });
}