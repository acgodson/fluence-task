import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { setLogLevel } from '@fluencelabs/fluence';
import 'react-toastify/dist/ReactToastify.css';

setLogLevel('trace');

ReactDOM.render(
    <React.StrictMode>
        <div>
            <App />
        </div>
    </React.StrictMode>,
    document.getElementById('root'),
);
