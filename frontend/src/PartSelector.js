import React from 'react';
import './PartSelector.scss'

function PartSelector({pattern, selectPart, selected}) {
    return (
        <div className="part-selector">
            <h2>Mönsterdelar</h2>
            <div className="parts">
                <ul>
                    {pattern && pattern.part_list.map((p) => (
                        <li className={selected === p[0] ? 'selected' : ''}>
                            <span onClick={() => selectPart(p[0])}>{p[1]}, {p[0]}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PartSelector;
