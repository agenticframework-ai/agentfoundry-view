import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import './styles/visionOrbit.css';
import './styles/brand.css';
import './styles/presentationControls.css';
import './styles/discoveryDemo.css';
import './styles/architecture.css';
import './styles/search.css';
import './styles/ragPlaybook.css';
import './styles/lightTheme.css';
import './styles/sageTheme.css';
import './styles/forestTheme.css';
import './styles/decision.css';
import './styles/finops.css';
import './styles/security.css';
import './styles/roiBusinessCase.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
