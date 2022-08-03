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
            selectedPattern: null,
            part: null,
            rowIndex: 0,
            stitchIndex: 0,
            eventState: {
                'topRight': 0,
                'topMiddle': 0,
                'topLeft': 0,
                'left': 0,
                'right': 0,
            }
        };
    }

    eventHandler(event) {
        console.log(event);
        this.setState((state) => {
            let rowIndex = state.rowIndex;
            let stitchIndex = state.stitchIndex;
            const pattern = state.pattern;
            const part = state.part;
            if (pattern && part) {
                const partPattern = pattern.parts[part];
                const row = partPattern.rows[rowIndex];
                if (state.eventState['left'] === 0 && event.key === 'left' && event.state) {
                    // next stitch
                    stitchIndex += 1;
                    if (stitchIndex >= row.expanded.length) {
                        stitchIndex = 0;
                        rowIndex += 1;
                        if (rowIndex >= partPattern.rows.length) {
                            rowIndex = partPattern.rows.length - 1;
                            stitchIndex = partPattern.rows[rowIndex].expanded.length - 1;
                        }
                    }
                } else if (state.eventState['right'] === 0 && event.key === 'right' && event.state) {
                    // prev stitch
                    stitchIndex -= 1;
                    if (stitchIndex < 0) {
                        rowIndex -= 1;
                        if (rowIndex < 0) {
                            rowIndex = 0;
                            stitchIndex = 0;
                        } else {
                            stitchIndex = partPattern.rows[rowIndex].expanded.length - 1;
                        }
                    }
                } else if (state.eventState['topLeft'] === 0 && event.key === 'topLeft' && event.state) {
                    // next row
                    rowIndex += 1;
                    stitchIndex = 0;
                    if (rowIndex >= partPattern.rows.length) {
                        rowIndex = partPattern.rows.length - 1;
                        stitchIndex = partPattern.rows[rowIndex].expanded.length - 1;
                    }
                } else if (state.eventState['topRight'] === 0 && event.key === 'topRight' && event.state) {
                    // prev row
                    rowIndex -= 1;
                    if (rowIndex < 0) {
                        rowIndex = 0;
                    }
                    stitchIndex = 0;
                }
            }
            return {
                eventState: {...state.eventState, [event.key]: event.state},
                rowIndex,
                stitchIndex,
            }
        });
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
                            this.setState({
                                selectedPattern: pattern,
                                part: null,
                                rowIndex: 0,
                                stitchIndex: 0,
                            });
                            crochet.selectPattern(pattern, cb);
                        }}
                    /></div>
                    <div className="middle"><PartSelector
                        pattern={this.state.pattern}
                        selectPart={(part) => this.setState({
                            part: part,
                            rowIndex: 0,
                            stitchIndex: 0,
                        })}
                        selected={this.state.part}
                    /></div>
                    <div className="bottom">
                        <Buttons
                            eventHandler={this.eventHandler}
                            eventState={this.state.eventState}
                        /></div>
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
                            part={this.state.part}
                            rowIndex={this.state.rowIndex}
                            stitchIndex={this.state.stitchIndex}
                        />
                    </div>
                    <div className="footer"></div>
                </div>
            </div>
        );
    }
}

export default App;
