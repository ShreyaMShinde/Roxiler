import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error: error
    });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          background: '#fee2e2', 
          color: '#991b1b', 
          border: '1px solid #f87171', 
          borderRadius: '12px', 
          margin: '20px', 
          fontFamily: 'sans-serif' 
        }}>
          <h2>Something went wrong in the application.</h2>
          <p><strong>Error:</strong> {this.state.error?.toString()}</p>
          <pre style={{ 
            overflow: 'auto', 
            background: '#fff', 
            padding: '12px', 
            border: '1px solid #f87171', 
            borderRadius: '6px', 
            fontSize: '0.85rem' 
          }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }} 
            style={{ 
              padding: '10px 20px', 
              background: '#991b1b', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              marginTop: '12px',
              fontWeight: 'bold'
            }}
          >
            Clear Session & Reset
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
