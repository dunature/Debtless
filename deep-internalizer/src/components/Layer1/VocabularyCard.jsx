/**
 * Vocabulary Card Component
 * Manages individual word state (split/syllable view)
 */
import { useState } from 'react';
import styles from './VocabularyCard.module.css';

export default function VocabularyCard({
    word,
    speak,
    isTTSLoading,
    onPeekStart,
    onPeekEnd
}) {
    const [isSplit, setIsSplit] = useState(false);
    const [activeSyllable, setActiveSyllable] = useState(null);

    const toggleSplit = (e) => {
        e.stopPropagation();
        setIsSplit(!isSplit);
    };

    const handlePlaySyllable = async (e, slice, index) => {
        e.stopPropagation();
        setActiveSyllable(index);
        // Play at slower speed for better articulation detail
        await speak(slice.text, { speed: 0.7 });
        setActiveSyllable(null);
    };

    return (
        <div className={`${styles.wordCard} animate-in fade-in slide-in-from-top-4`}>
            {/* Scissors (Split Phonetic) Button */}
            <button
                className={`${styles.scissorBtn} ${isSplit ? styles.active : ''}`}
                onClick={toggleSplit}
                title={isSplit ? "Show full word" : "Split into syllables"}
            >
                ✂️
            </button>

            <div className={styles.wordMain}>
                {isSplit && word.slices ? (
                    <div className={styles.splitWord}>
                        {word.slices.map((slice, idx) => (
                            <div
                                key={idx}
                                className={`${styles.syllableBlock} ${activeSyllable === idx ? styles.playing : ''}`}
                                onClick={(e) => handlePlaySyllable(e, slice, idx)}
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <span className={styles.syllableText}>{slice.text}</span>
                                <span className={styles.syllablePhonetic}>{slice.phonetic}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.wordTitleRow}>
                        <span className={styles.wordText}>{word.word}</span>
                        <div className={styles.wordMeta}>
                            <button
                                className={`btn btn-ghost ${styles.wordAudioBtn}`}
                                onClick={(e) => { e.stopPropagation(); speak(word.word); }}
                                disabled={isTTSLoading}
                                title="Listen to pronunciation"
                            >
                                {isTTSLoading ? '⏳' : '🔊'}
                            </button>
                            <span className={styles.phonetic}>{word.phonetic}</span>
                        </div>
                    </div>
                )}
            </div>

            <p className={styles.definition}>{word.definition}</p>

            {/* Peek Origin Button */}
            <button
                className={styles.peekButton}
                onMouseDown={onPeekStart}
                onMouseUp={onPeekEnd}
                onMouseLeave={onPeekEnd}
                onTouchStart={onPeekStart}
                onTouchEnd={onPeekEnd}
            >
                👁️ Hold to see original context
            </button>
        </div>
    );
}
