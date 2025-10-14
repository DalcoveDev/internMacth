
const SimpleTest = () => {
  // Test if import.meta.env is available
  const testEnv = () => {
    try {
      console.log('import.meta.env:', import.meta.env);
      console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
      return 'Environment variables are accessible';
    } catch (error) {
      console.error('Error accessing environment variables:', error);
      return 'Error accessing environment variables';
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Environment Test</h1>
      <p>{testEnv()}</p>
      <p>Check the browser console for details.</p>
    </div>
  );
};

export default SimpleTest;