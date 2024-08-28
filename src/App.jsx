import React from 'react'
import FrontPage from './FrontPage'
import SongInfo from './components/SongInfo'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
      {/* <Display></Display> */}
      <Routes>
        <Route path = '/' element={<FrontPage/>}/>
        <Route path = 'songInfo/:id' element={<SongInfo/>}/>
        </Routes>
      
        
    </div>
  )
}

export default App