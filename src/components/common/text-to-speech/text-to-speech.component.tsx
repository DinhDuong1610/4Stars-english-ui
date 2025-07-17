import React from 'react';
import { Button, Tooltip } from 'antd';
import { SoundOutlined } from '@ant-design/icons';

interface TextToSpeechProps {
    text: string;
    lang?: string;
}

const TextToSpeech = ({ text, lang = 'en-US' }: TextToSpeechProps) => {
    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.9;

            window.speechSynthesis.speak(utterance);
        } else {
            alert("Sorry, your browser does not support text-to-speech.");
        }
    };

    return (
        <Button
            type="text"
            icon={<SoundOutlined twoToneColor="#4096FF" />}
            onClick={handleSpeak}
            style={{ color: '#4096FF', fontSize: 18, fontWeight: 'bold', borderRadius: '50%', padding: 5, border: '2px solid #4096FF' }}
        />
    );
};

export default TextToSpeech;