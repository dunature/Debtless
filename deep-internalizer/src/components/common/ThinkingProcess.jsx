/**
 * Thinking Process UI
 * Visualizes the internal AI logic during long-running operations.
 */
import { useEffect, useRef } from 'react';
import styles from './ThinkingProcess.module.css';

export default function ThinkingProcess({ logs, currentStep }) {
    const scrollRef = useRef(null);

    // Auto-scroll to bottom of logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.pulseContainer}>
                    <div className={styles.pulse}></div>
                </div>
                <h3 className={styles.title}>AI Reasoning Engine</h3>
            </div>

            <div className={styles.terminal} ref={scrollRef}>
                {logs.map((log, index) => (
                    <div
                        key={index}
                        className={`${styles.logLine} ${log.type === 'active' ? styles.active : ''} ${log.type === 'done' ? styles.done : ''}`}
                    >
                        <span className={styles.timestamp}>[{log.timestamp}]</span>
                        <span className={styles.message}>{log.message}</span>
                        {log.type === 'active' && <span className={styles.cursor}>_</span>}
                    </div>
                ))}
            </div>

            <div className={styles.status}>
                <span className={styles.statusLabel}>STATUS:</span>
                <span className={styles.statusValue}>{currentStep || 'INITIALIZING'}</span>
            </div>
        </div>
    );
}
