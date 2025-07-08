import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './SharedPage/Navbar/Navbar'
function App() {

  return (
    <div className='max-w-7xl mx-auto'>
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  )
}

export default App
