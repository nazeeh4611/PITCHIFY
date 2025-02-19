import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      // Add this line to define a placeholder token for development
      '__WS_TOKEN__': JSON.stringify('development-token'),
    },
    server: {
      hmr: {
        // Configure HMR properly
        protocol: 'ws',
        host: 'localhost',
      },
    }
  };
});