import { useState, useEffect } from 'react';
import LandingPage from './LandingPage'
import About from './About';
import './App.css'

function SideNav({openModal, closeModal, isOpen}) {
  if (isOpen)
    return (
      <button className='side-nav-modal' onClick={closeModal}>
        <img src={'./arrow-inv.png'} alt="AI gif" style={{ height: "20px",width: "10px", color: "red"}}></img>
      </button>
    )
  else
    return (
      <button className='side-nav' onClick={openModal}>
        <img src={'./arrow.png'} alt="AI gif" style={{ height: "20px",width: "10px", color: "red"}}></img>
      </button>
    )
}


function App() {

  const [isOpen, setIsOpen] = useState(false)
  const [onLightMode, setOnLightMode] = useState(false)

  function alterMode() {
      setOnLightMode(!onLightMode)
  }

  function openModal (){
    setIsOpen(true)
  } 
  
  function closeModal (){
    setIsOpen(false)
  }

  useEffect(() => {
  }, [onLightMode])

  useEffect(() => {
    let timeoutId;
    let mins = 5

    const resetPageOnInactive = () => {
      timeoutId = setTimeout(() => {
        window.alert('Timeout')
        window.location.reload()
      }, mins * 60 * 1000)
    }

    const clearInactiveTimeout = () => {
      clearTimeout(timeoutId)
    }

    const handleUserActivity = () => {
      clearInactiveTimeout()
      resetPageOnInactive()
    }

    resetPageOnInactive()

    document.addEventListener('mousemove', handleUserActivity)
    document.addEventListener('keydown', handleUserActivity)

    return () => {
      document.removeEventListener('mousemove', handleUserActivity)
      document.removeEventListener('keydown', handleUserActivity)
      clearInactiveTimeout()
    }

  }, [])
    

  return (
    <div>
      <div className={onLightMode? 'page-lightmode' : 'page-darkmode'}>
        <SideNav openModal={openModal} closeModal={closeModal} isOpen={isOpen}/>
        <About isOpen={isOpen} alterMode={alterMode} onLightMode={onLightMode}/>
        <LandingPage isOpen={isOpen}/>
      </div>
    </div>
    
  );
}

export default App;
