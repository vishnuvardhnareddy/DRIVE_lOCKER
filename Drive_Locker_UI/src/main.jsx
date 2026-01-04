import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './index.css'
import { NotesProvider } from './context/NotesContext.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { FileProvider } from './context/FileContext.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    {/* ✅ ADDED: Opening fragment to group elements */}
    <>
      <ToastContainer
        position="top-center"
        toastClassName="bg-gray-900 text-white border border-emerald-500 shadow-xl rounded-xl px-6 py-4 font-semibold"
        bodyClassName="text-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <AppContextProvider>
        <NotesProvider>
          <FileProvider>
            <App />
          </FileProvider>
        </NotesProvider>
      </AppContextProvider>
    </>
    {/* ✅ ADDED: Closing fragment */}
  </Router>
)