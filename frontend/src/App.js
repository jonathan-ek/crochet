import logo from './logo.svg';
import './App.css';

function App() {
  const crochet = window.crochet;
  const patterns = crochet.getPatterns();
  const cb = (data, err) => {
    console.log(data);
    console.log(err);
  }
  return (
    <div className="App">
      <h1>Mönsterfiler:</h1>
      <ul>
        {patterns.map((p) => (<li>{p}</li>))}
      </ul>
    </div>
  );
}

export default App;
