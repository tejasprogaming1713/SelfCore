import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function App() {
  const termRef = useRef();
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const term = new Terminal({ cursorBlink: true });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(termRef.current);
    fitAddon.fit();

    fetch("http://selfcorex.duckdns.org:3001/session/new")
      .then(res => res.json())
      .then(data => {
        setSessionId(data.id);
        const ws = new WebSocket(`ws://selfcorex.duckdns.org:3001/?id=${data.id}`);
        ws.onmessage = e => term.write(e.data);
        term.onData(data => ws.send(data));
      });
  }, []);

  return <div ref={termRef} style={{ width: "100%", height: "100vh" }}></div>;
}
