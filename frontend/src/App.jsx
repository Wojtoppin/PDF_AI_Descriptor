
import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Descriptor from './components/Descriptor.jsx'
function App() {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Descriptor />
      </main>
      <Footer />
    </div>
  )
}

export default App
