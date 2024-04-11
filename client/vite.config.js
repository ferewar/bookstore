// Import the necessary functions and plugins for configuration.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Add any Vite plugins used in the project.
  plugins: [react()],
  
  // Configuration for the development server.
  server: {
    port: 3000, // Specifies the port on which the development server will run.
    open: true, // Tells the server to automatically open the app in the browser when started.
    
    //Define proxies for API requests made from the client. Useful in development to avoid CORS issues.
    proxy: {
      '/graphql': { 
        target: 'http://localhost:3001', 
        secure: false, 
        changeOrigin: true, 
      }
    }
  }
})
