import { useState, useRef, useEffect } from 'react';
import { GameLog } from '../hooks/useGame';

interface Props {
  logs: GameLog[];
  onCommand: (cmd: string) => void;
}

export function ConsolePanel({ logs, onCommand }: Props) {
  const [input, setInput] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div className="console-panel" onClick={() => inputRef.current?.focus()}>
      <div className="log-container">
        {logs.map((log) => (
          <div key={log.id} className={`log-entry ${log.type}`}>
            {log.text}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      <form className="input-container" onSubmit={handleSubmit}>
        <span className="input-prompt">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          className="command-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="לדוגמה: 'לכי צפונה', 'קחי שרביט', 'החליפי אחות'..."
          autoFocus
          autoComplete="off"
        />
      </form>
    </div>
  );
}
