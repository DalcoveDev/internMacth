import { useEffect } from 'react';
import { testFunction } from '@/lib/test-api-client';

const EnvTest = () => {
  useEffect(() => {
    // Test the test function
    const result = testFunction();
    console.log('Test function result:', result);
    
    // Test if we can access import.meta.env
    try {
      console.log('import.meta.env test:');
      console.log('typeof import.meta:', typeof import.meta);
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
      } else {
        console.log('import.meta.env not available');
      }
    } catch (error) {
      console.error('Error accessing import.meta.env:', error);
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Test</h1>
      <p>Check the browser console for environment variable information.</p>
    </div>
  );
};

export default EnvTest;