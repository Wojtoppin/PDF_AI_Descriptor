import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Descriptor from './components/Descriptor.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <main>
        <Descriptor />
      </main>
      
    </>
  )
}

export default App
