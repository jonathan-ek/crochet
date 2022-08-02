import React from 'react';
import './PartInfo.scss'
import {capitalize} from "./utils";

function PartInfo({pattern, patternName, part}) {
    return (
        <div className="part-info">
            <h2>{pattern && capitalize(patternName.replace('.cro', ''))} - {part}</h2>
        </div>
    );
}

export default PartInfo;
