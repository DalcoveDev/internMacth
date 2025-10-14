// Test file to check environment variable access
console.log('Test file loaded');

// Try to access import.meta.env safely
try {
  if (typeof import.meta !== 'undefined') {
    console.log('import.meta is available');
    if (import.meta.env) {
      console.log('import.meta.env is available');
      console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    } else {
      console.log('import.meta.env is not available');
    }
  } else {
    console.log('import.meta is not available');
  }
} catch (error) {
  console.error('Error accessing import.meta:', error);
}

export const testFunction = () => {
  console.log('Test function called');
  return 'test';
};