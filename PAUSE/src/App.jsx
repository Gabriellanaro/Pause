import { useState } from 'react'
import img from './assets/img.jpg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null)
  const [inputText, setInputText] = useState('')

  const sendHttpRequest = async () => {
    try {

      const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ myInput: inputText }),
      });

      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={sendHttpRequest} className="send-button">
          Send Text
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