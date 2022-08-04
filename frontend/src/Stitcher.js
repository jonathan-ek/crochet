import React from 'react';
import './Stitcher.scss'
import {capitalize} from "./utils";

function Stitcher({pattern, part, rowIndex, stitchIndex, saved, loadSave}) {
    console.log(Object.entries(saved))
    if (!pattern || !part) {
        return (
            <div className="stitcher">
                <div>
                    <h2>Sparade virkningar</h2>
                    <ul>
                        {Object.entries(saved).map(([idx, save]) => (
                            <li>
                                <span
                                    onClick={() => loadSave(idx)}>{new Date(save.timestamp).toISOString().replace('T', ' ').split('.',1)[0]} <span className="pipe">|</span> {capitalize(save.pattern.replace('.cro', ''))} - {save.part} </span>
                            </li>))}
                    </ul>
                </div>
            </div>
        );
    }
    const partPattern = pattern.parts[part];
    const row = partPattern.rows[rowIndex];
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
