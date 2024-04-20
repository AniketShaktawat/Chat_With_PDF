import React, { createContext, useState, useContext } from 'react';
import startupplaybook from "./Startup_Playbook.pdf"
const FileContext = createContext();


export const FileProvider = ({ children }) => {
    const [fileUrl, setFileUrl] = useState(startupplaybook);

    const updateFileUrl = (newUrl) => {
        setFileUrl(newUrl);
    };

    return (
        <FileContext.Provider value={{ fileUrl, updateFileUrl }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFileContext = () => useContext(FileContext);