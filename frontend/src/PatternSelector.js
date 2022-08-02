import React from 'react';

function PatternSelector({patterns}) {
    return (
        <>
            <h1>Mönsterfiler:</h1>
            <ul>
                {patterns.map((p) => (<li>{p}</li>))}
            </ul>
        </>
    );
}

export default PatternSelector;