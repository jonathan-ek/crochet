import React from 'react';
import './Stitcher.scss'
import {capitalize} from "./utils";

function Stitcher({pattern, part, rowIndex, stitchIndex, saved, loadSave, half}) {
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
                                    onClick={() => loadSave(idx)}>{new Date(save.timestamp).toISOString().replace('T', ' ').split('.', 1)[0]}
                                    <span
                                        className="pipe">|</span> {capitalize(save.pattern.replace('.cro', ''))} - {save.part} </span>
                            </li>))}
                    </ul>
                </div>
            </div>
        );
    }
    const partPattern = pattern.parts[part];
    const row = partPattern.rows[rowIndex];
    const rowCount = (r) => {
        return r.expanded.reduce((acc, cur) => {
            const s = Object.fromEntries(pattern.stitches)[cur];
            if (s === null) {
                acc += 1;
            } else if (s === '++') {
                acc += 2;
            } else if (s === '--') {
                acc += 1;
            }
            return acc;
        }, 0)
    };
    return (
        <div className="stitcher">
            <h2>{row.nr} / {partPattern.rows[partPattern.rows.length - 1].nr}</h2>
            <span>{Object.fromEntries(pattern.stitches)[row.expanded[stitchIndex]] === '++' ? half : ''}</span>
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
            <div className="row-info">
                <p className="prev-row-count">({rowIndex !== 0 && rowCount(partPattern.rows[rowIndex-1])})</p>
                <p>{row.row} ({rowCount(row)})</p>
            </div>
            <p>{row.comment}</p>
        </div>
    );
}

export default Stitcher;
