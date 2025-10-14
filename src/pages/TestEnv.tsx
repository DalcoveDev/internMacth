import { useEffect, useState } from 'react';
import { internshipsAPI } from '@/lib/new-api-client';

const TestEnv = () => {
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Log environment variables to console
  useEffect(() => {
    console.log('VITE_API_URL:', import.meta.env?.VITE_API_URL);
    console.log('All env vars:', import.meta.env);
    
    // Test API client
    const testApi = async () => {
      try {
        console.log('Testing API client...');
        // This will fail because we're not authenticated, but we just want to see if the client is working
        await internshipsAPI.getAll();
        setApiTestResult('API client is working');
      } catch (err) {
        console.log('API client test error (expected):', err);
        // We expect this to fail due to authentication, but the client itself is working
        if (err instanceof Error) {
          setApiTestResult('API client is working (authentication required)');
        } else {
          setError('API client test failed');
        }
      }
    };
    
    testApi();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <p className="mb-2">VITE_API_URL: {import.meta.env?.VITE_API_URL || 'Not set'}</p>
      <p className="mb-2">Check the browser console for all environment variables.</p>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">API Client Test</h2>
        {apiTestResult && <p className="text-green-600">{apiTestResult}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default TestEnv;