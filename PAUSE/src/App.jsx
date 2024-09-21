import { useState } from 'react'
import img from './assets/img.jpg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null)

  const sendHttpRequest = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const result = await response.json();
      setData(result); 
      console.log(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <>
      <img src={img} alt="logo" />
      <h1>PAUSE</h1>
      <h2>Take a break from fast fashion</h2>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <br />
        <br />
        <button onClick={sendHttpRequest}>
          Fetch Data
        </button>
        
      </div>
      
      {data && (
        <div>
          <h2>Fetched Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </>
  )
}

export default App