import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useFileContext } from './FileContext';
import startup from "./Startup_Playbook.pdf"
function PdfViewerComponent({ file }) {
    const fileUrl = useFileContext().fileUrl;

    return (
        <div className="pdf-viewer-container">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={fileUrl} />
            </Worker>
        </div>
    );
}

export default PdfViewerComponent;
