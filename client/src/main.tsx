import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  //TODO вернуть React.StrictMode при сборке проекта
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
)
