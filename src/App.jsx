import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import TheWorld from "./components/TheWorld.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
        <TheWorld />
    </div>
  )
}

export default App
