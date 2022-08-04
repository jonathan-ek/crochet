import React from 'react';
import './PatternSelector.scss'
import {capitalize} from "./utils";

function PatternSelector({patterns, selectPattern, selected}) {
    return (
        <div className="pattern-selector">
            <h2>Mönsterfiler</h2>
            <div className="patterns">
                <ul>
                    {patterns.map((p) => (
                        <li className={selected === p ? 'selected' : ''}>
                            <span onClick={() => selectPattern(p)}>{capitalize(p.replace('.cro', ''))}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PatternSelector;
