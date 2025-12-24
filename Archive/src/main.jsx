import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TrendingCard from "./components/trendingCard.jsx";

createRoot(document.getElementById('root')).render(

    <App />,
)
