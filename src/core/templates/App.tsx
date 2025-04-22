import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='App'>
      <h1>Rspack + React + TypeScript</h1>
      <div className='card'>
        <button type='button' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;
