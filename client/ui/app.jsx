import React, {useState, useEffect} from 'react';
import './app.css';

function App() {
  // Create the count state.
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Hello ${count}`;
    console.log("effect");
  }, []);

  return (
    <div className="App">
    <header className="App-header" onClick={() => setCount(count + 1)}>
      <p>
        Page has been open for <code>{count}</code> second.
      </p>
    </header>
    </div>
  );
}

export { App };
