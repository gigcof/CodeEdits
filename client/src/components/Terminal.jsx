import React, { useEffect, useRef } from "react";
import { Terminal as XTerminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import socket from "../socket";

const Terminal = () => {
    const terminalRef = useRef(null);
    const isRendered = useRef(false);

    useEffect(() => {
        if (isRendered.current) return;
        isRendered.current = true;
        const terminal = new XTerminal({
            rows: 20,
            cols: 80,
            cursorBlink: true,
            cursorStyle: 'underline',
            fontSize: 16,
            fontFamily: 'monospace',
            theme: {
                background: '#282c34',
                foreground: '#abb2bf',
                cursor: '#abb2bf',
                black: '#282c34',
                red: '#e06c75',
                green: '#98c379',
                yellow: '#e5c07b',
                blue: '#61afef',
                magenta: '#c678dd',
                cyan: '#56b6c2',
                white: '#dcdfe4',
                brightBlack: '#5c6370',
                brightRed: '#e06c75',
                brightGreen: '#98c379',
                brightYellow: '#e5c07b',
                brightBlue: '#61afef',
                brightMagenta: '#c678dd',
                brightCyan: '#56b6c2',
                brightWhite: '#dcdfe4'
            }
        });
        terminal.open(terminalRef.current);
        terminal.onData(data => {
            socket.emit('terminal:write', data);
            console.log(data);
        });
        function onTerminalData(data) {
            terminal.write(data);
        }
        socket.on('terminal:data', data => {
            onTerminalData(data);
        });
        return () => {
            socket.off('terminal:data', onTerminalData);
            // terminal.dispose();
        };
    } , []);
    return <div ref={terminalRef} id="terminal" />;
};

export default Terminal;
