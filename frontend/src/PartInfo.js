import React from 'react';
import './PartInfo.scss'
import {capitalize} from "./utils";

function PartInfo({pattern, patternName, part}) {
    return (
        <div className="part-info">
            {pattern ? (
                <h1>{capitalize(patternName.replace('.cro', ''))} {part ? '-' : ''} {part}</h1>
            ) : (<h2>Välj mönster och del i menyn.</h2>)}
        </div>
    );
}

export default PartInfo;
