import React from 'react';
import './Stitcher.scss'
import {capitalize} from "./utils";

function Stitcher({pattern, patternName, part}) {
    return (
        <div className="stitcher">
            <h2>{pattern && capitalize(patternName.replace('.cro', ''))} - {part}</h2>
        </div>
    );
}

export default Stitcher;
