import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import {AuthProvider} from './contexts/AuthContext.jsx'
import { RequestProvider } from './contexts/RequestContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AuthProvider>
        <RequestProvider> 
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </RequestProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
