import { useEffect } from 'react'
import { Link, Route } from 'wouter'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/home/index.jsx'

function App() {
  return (
    <>
      <Navbar />
      <Route path="/" component={ Home } />
      <Footer />
    </>
  )
}

export default App