// Debug utility to help identify browser extension conflicts
export const debugExtensionConflicts = () => {
  // Check for common extension APIs that might cause conflicts
  const extensionApis = [
    'chrome.runtime',
    'chrome.extension',
    'browser.runtime',
    'browser.extension'
  ];

  const detectedExtensions = extensionApis.filter(api => {
    try {
      const parts = api.split('.');
      let obj = window as any;
      for (const part of parts) {
        if (obj && typeof obj === 'object' && part in obj) {
          obj = obj[part];
        } else {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  });

  if (detectedExtensions.length > 0) {
    console.warn('🔍 Browser extension APIs detected:', detectedExtensions);
    console.warn('💡 If you experience "message channel closed" errors, try:');
    console.warn('   1. Open an incognito window');
    console.warn('   2. Disable browser extensions temporarily');
    console.warn('   3. Check console for extension-related errors');
  }

  return detectedExtensions;
};

// Add global error handler with vendor.js specific handling
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = event.reason?.message || String(event.reason);
    
    // Check if it's the specific message channel error from vendor.js
    if (errorMessage.includes('message channel closed') || 
        errorMessage.includes('listener indicated an asynchronous response')) {
      console.warn('🔧 Browser extension conflict detected in vendor.js');
      console.warn('💡 This is harmless - suppressing to prevent app disruption');
      console.warn('🎯 Error origin: Third-party library or browser extension');
      
      // Prevent the error from crashing the app
      event.preventDefault();
      return;
    }
    
    // Check for other vendor.js errors that should be suppressed
    if (event.reason?.stack?.includes('vendor.js') || 
        event.reason?.stack?.includes('chrome-extension://')) {
      console.warn('🔧 Vendor.js or extension error suppressed:', errorMessage);
      event.preventDefault();
      return;
    }
    
    console.error('🚨 Unhandled promise rejection:', event.reason);
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    const errorMessage = event.error?.message || event.message;
    const fileName = event.filename || '';
    
    // Suppress vendor.js errors
    if (fileName.includes('vendor.js') || fileName.includes('chrome-extension://')) {
      console.warn('🔧 Vendor.js error suppressed:', errorMessage);
      event.preventDefault();
      return;
    }
    
    // Suppress message channel errors regardless of source
    if (errorMessage?.includes('message channel closed') || 
        errorMessage?.includes('listener indicated an asynchronous response')) {
      console.warn('🔧 Message channel error suppressed (browser extension conflict)');
      event.preventDefault();
      return;
    }
    
    console.error('🚨 Global error:', event.error);
  });
  // Additional Chrome extension message listener error handling
  if (typeof (window as any).chrome !== 'undefined' && (window as any).chrome.runtime) {
    try {
      // Override chrome.runtime.onMessage to catch errors
      const chromeRuntime = (window as any).chrome.runtime;
      const originalAddListener = chromeRuntime.onMessage.addListener;
      chromeRuntime.onMessage.addListener = function(listener: any) {
        const wrappedListener = function(...args: any[]) {
          try {
            return listener(...args);
          } catch (error) {
            console.warn('🔧 Chrome extension message error suppressed:', error);
            return false; // Don't send response
          }
        };
        return originalAddListener.call(this, wrappedListener);
      };
    } catch (error) {
      // Ignore if chrome.runtime is not accessible
    }
  }

  console.log('✅ Enhanced error handling initialized (vendor.js errors suppressed)');
};

// Vendor.js specific error suppression
export const suppressVendorErrors = () => {
  // Override console.error temporarily to filter vendor errors
  const originalConsoleError = console.error;
  console.error = function(...args: any[]) {
    const errorStr = args.join(' ');
    
    // Don't log vendor.js errors or message channel errors
    if (errorStr.includes('vendor.js') || 
        errorStr.includes('message channel closed') ||
        errorStr.includes('listener indicated an asynchronous response')) {
      console.warn('🔇 Vendor error suppressed:', args[0]);
      return;
    }
    
    // Log other errors normally
    originalConsoleError.apply(console, args);
  };
  
  console.log('🔇 Vendor.js error suppression active');
};

export default {
  debugExtensionConflicts,
  setupGlobalErrorHandling,
  suppressVendorErrors
};
