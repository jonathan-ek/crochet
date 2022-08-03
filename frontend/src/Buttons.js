import React from 'react';
import './Buttons.scss'

function Buttons({eventHandler, eventState}) {
    return (
        <div className="buttons">
            <table>
                <tbody>
                <tr>
                    <td>
                        <div
                            onMouseDown={() => eventHandler({key: 'topLeft', state: 1})}
                            onMouseUp={() => eventHandler({key: 'topLeft', state: 0})}
                            className={"small-button" + (eventState['topLeft'] ? ' active' : '')}
                        />
                    </td>
                    <td>
                        <div
                            onMouseDown={() => eventHandler({key: 'topMiddle', state: 1})}
                            onMouseUp={() => eventHandler({key: 'topMiddle', state: 0})}
                            className={"small-button" + (eventState['topMiddle'] ? ' active' : '')}
                        />
                    </td>
                    <td>
                        <div
                            onMouseDown={() => eventHandler({key: 'topRight', state: 1})}
                            onMouseUp={() => eventHandler({key: 'topRight', state: 0})}
                            className={"small-button" + (eventState['topRight'] ? ' active' : '')}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <div
                            onMouseDown={() => eventHandler({key: 'left', state: 1})}
                            onMouseUp={() => eventHandler({key: 'left', state: 0})}
                            className={"big-button" + (eventState['left'] ? ' active' : '')}
                        />
                    </td>
                    <td />
                    <td>
                        <div
                            onMouseDown={() => eventHandler({key: 'right', state: 1})}
                            onMouseUp={() => eventHandler({key: 'right', state: 0})}
                            className={"big-button" + (eventState['right'] ? ' active' : '')}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Buttons;
