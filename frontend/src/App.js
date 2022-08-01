import logo from './logo.svg';
import './App.css';

function App() {
  console.log(window.pattern_files)
  const cb = (data, err) => {
    console.log(data);
    console.log(err);
  }
  window.selectPattern(window.pattern_files[0], cb)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
