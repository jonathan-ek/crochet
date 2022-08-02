import React from 'react';
import './App.scss';
import PatternSelector from "./PatternSelector";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pattern: null,
        };
    }
    render() {
        const crochet = window.crochet;
        // const crochet = {getPatterns: () => [], selectPattern: () => {}};
        const patterns = crochet.getPatterns();
        const cb = (data, err) => {
            this.setState({pattern: data})
        }
        return (
            <div className="App">
                <div className="left-panel">
                    <PatternSelector
                        patterns={patterns}
                        selectPattern={(pattern) => crochet.selectPattern(pattern, cb)}
                    />
                </div>
                <div className="right-panel">
                    <div className="header"></div>
                    <div className="center"></div>
                    <div className="footer"></div>
                </div>
            </div>
        );
    }
}

export default App;
