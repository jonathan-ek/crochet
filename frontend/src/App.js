import React from 'react';
import './App.scss';
import PatternSelector from "./PatternSelector";
import PartSelector from "./PartSelector";
import PartInfo from "./PartInfo";
import Stitcher from "./Stitcher";
import Buttons from "./Buttons";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.eventHandler = this.eventHandler.bind(this);
        this.state = {
            pattern: null,
        };
    }

    eventHandler(event) {
        console.log(event);
    }

    render() {
        const crochet = window.crochet;
        const patterns = crochet.getPatterns();
        const cb = (data, err) => {
            console.log(JSON.stringify(data));
            this.setState({pattern: data})
        }
        crochet.connectPedal(this.eventHandler);
        return (
            <div className="App">
                <div className="left-panel">
                    <div className="top"><PatternSelector
                        patterns={patterns}
                        selected={this.state.selectedPattern}
                        selectPattern={(pattern) => {
                            this.setState({selectedPattern: pattern, part: null});
                            crochet.selectPattern(pattern, cb);
                        }}
                    /></div>
                    <div className="middle"><PartSelector
                        pattern={this.state.pattern}
                        selectPart={(part) => this.setState({part: part})}
                        selected={this.state.part}
                    /></div>
                    <div className="bottom"><Buttons eventHandler={this.eventHandler}/></div>
                </div>
                <div className="right-panel">
                    <div className="header">
                        <PartInfo
                            pattern={this.state.pattern}
                            patternName={this.state.selectedPattern}
                            part={this.state.part}
                        />
                    </div>
                    <div className="center">
                        <Stitcher
                            pattern={this.state.pattern}
                            patternName={this.state.selectedPattern}
                            part={this.state.part}
                        />
                    </div>
                    <div className="footer"></div>
                </div>
            </div>
        );
    }
}

export default App;
