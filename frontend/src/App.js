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
            },
            saved: [],
            lastAction: new Date().valueOf(),
            half: 0,
        };
        setInterval(() => {
            this.setState((state) => ({lastAction: state.lastAction + 1}));
        }, 1000)
    }

    componentDidMount() {
        window.crochet.fetchSaves(null, (saved) => {
            this.setState({saved});
        })
    }

    eventHandler(event) {
        console.log(event);
        this.setState((state) => {
            let rowIndex = state.rowIndex;
            let stitchIndex = state.stitchIndex;
            let half = state.half;
            const pattern = state.pattern;
            const part = state.part;
            if (pattern && part) {
                const partPattern = pattern.parts[part];
                const row = partPattern.rows[rowIndex];
                const stitch = Object.fromEntries(pattern.stitches)[row.expanded[stitchIndex]];
                if (state.eventState['left'] === 0 && event.key === 'left' && event.state) {
                    // next stitch
                    if ((stitch === '++' && half === 1) || stitch !== '++') {
                        stitchIndex += 1;
                        if (stitchIndex >= row.expanded.length) {
                            stitchIndex = 0;
                            rowIndex += 1;
                            if (rowIndex >= partPattern.rows.length) {
                                rowIndex = partPattern.rows.length - 1;
                                stitchIndex = partPattern.rows[rowIndex].expanded.length - 1;
                            }
                        }
                        half = 0;
                    } else if (stitch === '++' && half === 0) {
                        half = 1;
                    }
                } else if (state.eventState['right'] === 0 && event.key === 'right' && event.state) {
                    // prev stitch
                    if ((stitch === '++' && half === 0) || stitch !== '++') {
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
                        if (Object.fromEntries(pattern.stitches)[row.expanded[stitchIndex]] === '++') {
                            half = 0;
                        }
                    } else if (stitch === '++' && half === 1) {
                        half = 0;
                    }
                } else if (state.eventState['topLeft'] === 0 && event.key === 'topLeft' && event.state) {
                    // next row
                    rowIndex += 1;
                    stitchIndex = 0;
                    half = 0;
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
                    half = 0;
                } else if (state.eventState['topMiddle'] === 0 && event.key === 'topMiddle' && event.state) {
                    // Save
                    window.crochet.save(state.selectedPattern, part, rowIndex, stitchIndex)
                }
            }
            return {
                eventState: {...state.eventState, [event.key]: event.state},
                rowIndex,
                stitchIndex,
                lastAction: new Date().valueOf(),
                half,
            }
        });
    }

    render() {
        const crochet = window.crochet;
        const patterns = crochet.getPatterns();
        const cb = (data, err) => {
            this.setState({pattern: data})
        }
        crochet.connectPedal(this.eventHandler);
        return (
            <div className="App">
                <div className="left-panel">
                    <div className="top">
                        <PatternSelector
                            patterns={patterns}
                            selected={this.state.selectedPattern}
                            selectPattern={(pattern) => {
                                if (pattern === this.state.selectedPattern) {
                                    pattern = null;
                                    this.setState({pattern: null});
                                }
                                this.setState({
                                    selectedPattern: pattern,
                                    part: null,
                                    rowIndex: 0,
                                    stitchIndex: 0,
                                });
                                window.crochet.fetchSaves(pattern, (saved) => {
                                    this.setState({saved});
                                })
                                if (pattern) {
                                    crochet.selectPattern(pattern, cb);
                                }
                            }}
                        />
                    </div>
                    <div className="middle">
                        <PartSelector
                            pattern={this.state.pattern}
                            selectPart={(part) => this.setState({
                                part: part,
                                rowIndex: 0,
                                stitchIndex: 0,
                            })}
                            selected={this.state.part}
                        />
                    </div>
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
                            saved={this.state.saved}
                            half={this.state.half}
                            loadSave={(id) => {
                                const save = this.state.saved[id];
                                this.setState({
                                    selectedPattern: save.pattern,
                                    part: save.part,
                                    rowIndex: save.rowIndex,
                                    stitchIndex: save.stitchIndex,
                                });
                                crochet.selectPattern(save.pattern, cb);
                            }}
                        />
                    </div>
                    <div className="footer">
                        {((new Date().valueOf() - this.state.lastAction) / 1000).toString(10).split('.', 1)}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
