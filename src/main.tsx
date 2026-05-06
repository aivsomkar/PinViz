import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { useAuthStore } from './store/authStore';

useAuthStore.getState().init();

createRoot(document.getElementById('root')!).render(<App />);
