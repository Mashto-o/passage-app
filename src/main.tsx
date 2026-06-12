import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'
import { FilterProvider } from './context/FilterContext'
import { OnboardingProvider } from './context/OnboardingContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <OnboardingProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </OnboardingProvider>
    </BrowserRouter>
  </StrictMode>,
)
