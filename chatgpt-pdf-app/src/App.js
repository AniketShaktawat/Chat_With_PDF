import React from 'react';
import ReactDOM from 'react-dom';
import ChatApplication from './components/ChatApplication';
import './App.css';
import { FileProvider } from '../src/components/FileContext';

function App() {
    return (
        <FileProvider>
            <div className="App">
            <ChatApplication />
        </div>
        </FileProvider>
    );
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
