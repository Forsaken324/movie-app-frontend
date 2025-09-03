import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { ClerkProvider } from '@clerk/clerk-react'
import { AuthProvider } from './contexts/AuthContext.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing publishable key');
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
      <BrowserRouter>
        <App />
      </ BrowserRouter>
    </ClerkProvider>
  </AuthProvider>,
)
