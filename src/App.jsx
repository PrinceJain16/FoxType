import { useState } from 'react'
import Header from './components/header.jsx'
import ToolBar from './components/toolBar.jsx'
import TypingArea from './components/TypingArea.jsx'
import LiveStats from './components/LiveStats.jsx'

import './App.css'

function App() {
  
  return (
    <div className='min-h-screen bg-gray-100 text-center p-6 font-mono'>
      <Header />
      <ToolBar />
      <TypingArea />
      <LiveStats />
      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
</div>

    </div>
  )
}

export default App
