// src/components/ChatApplication.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';  
import PdfUploader from './PdfUploader';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './ChatApplication.css';
import PdfViewer from './PdfViewer';
import { CircularProgress } from '@mui/material';

function ChatApplication() {
    const [sessionId, setSessionId] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const messagesEndRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!sessionId) {
            const getSession = async () => {
                const response = await axios.get('http://localhost:5000/get_session');
                setSessionId(response.data.session_id);
            };
            getSession();
        }
    }, [sessionId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (inputMessage.trim()) {
            setIsLoading(true);
            setChatHistory([...chatHistory, { role: 'user', content: inputMessage }]);
            try {
                const response = await axios.post('http://localhost:5000/ask_question', {
                    session_id: sessionId,
                    question: inputMessage,
                });
                setChatHistory(currentHistory => [...currentHistory, { role: 'assistant', content: response.data.answer }]);
            } catch (error) {
                console.error('Error sending message:', error);
                setChatHistory(currentHistory => [...currentHistory, { role: 'assistant', content: "Failed to get response." }]);
            }
            setInputMessage('');
            setIsLoading(false);
        }
    };

    const clearChatHistory = () => {
        setChatHistory([]);
    };

    const handlePdfUpload = (file) => {
        setIsUploading(true);
        const fileURL = URL.createObjectURL(file);
        setPdfFile(fileURL);
        setSessionId(null);
        clearChatHistory();
        
        setTimeout(() => {
            console.log("Test")
            alert('PDF uploaded successfully!');
            setIsUploading(false);
          }, 3000);
    };

    const handleFileSelected = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPdfFile(URL.createObjectURL(file));
            handlePdfUpload(file);
        }
    };

    return (
        <div className="app-container">        
        <div className='left'>
        <div className="nav-bar">
            <h1>Chat with any PDF</h1>
            <p>Upload your pdf and ask relevant questions (The Startup Playbok is the default PDF)</p>
        <PdfUploader
            setSessionId={setSessionId}
            onUploadSuccess={clearChatHistory}
            onPdfUpload={handlePdfUpload} 
        />       
        </div>
        <div className={pdfFile ? "split-container" : "chat-fullscreen"}>
            
  
            <div className="chat-container">
                <div className="chat-history">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            {msg.content}
                        </div>
                    ))}
                    {isLoading && <div className="message system">Generating Response...</div>}
                    <div ref={messagesEndRef} />
                </div>
                <form className="input-group" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                        placeholder="Type your message and press Enter"
                    />
                    <button type="submit" className="send-button">
                        &#x2B06;
                    </button>
                </form>
            </div>
            {pdfFile && (
          <div className="pdf-container">
            <Worker>
              <Viewer fileUrl={pdfFile} />
            </Worker>
          </div>
        )}
      </div>
        </div>
        <div className='right'>
            <PdfViewer></PdfViewer>
        </div>
    </div>
    );
}

export default ChatApplication;
