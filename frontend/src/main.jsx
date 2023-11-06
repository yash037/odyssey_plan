import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import TaskEditor from './pages/dashboard/components/TaskEditor.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TaskEditor></TaskEditor>
  </React.StrictMode>,
)
