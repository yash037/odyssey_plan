import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import NoteEditor from './pages/dashboard/components/NoteEditor.jsx'
import Upload from './global/mediaUploader.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NoteEditor />
  </React.StrictMode>
)
