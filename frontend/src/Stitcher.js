import React from 'react';
import './Stitcher.scss'
import {capitalize} from "./utils";

function Stitcher({pattern, part, rowIndex, stitchIndex}) {
    if (!pattern || !part) {
        return (
        <div className="stitcher">
            <h2>Välj mönster och del i menyn.</h2>
        </div>
    );
    }
    const partPattern = pattern.parts[part];
    const row = partPattern.rows[rowIndex];
    console.log(row);
    return (
        <div className="stitcher">
            <h2>{row.nr}</h2>
            <div className="stitches">
                <div className="previous">
                    <div className="content">
                    {stitchIndex > 0 && row.expanded.slice(0, stitchIndex).map((st) => (
                        <span className="stitch">{st}</span>
                    ))}</div>
                </div>
                <div className="current">{row.expanded[stitchIndex]}</div>
                <div className="next">
                    <div className="content">
                    {row.expanded.slice(stitchIndex + 1).map((st) => (
                        <span className="stitch">{st}</span>
                    ))}</div>
                </div>
            </div>
            <p>{row.comment}</p>
        </div>
    );
}

export default Stitcher;
