import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // You can also log the error to an error reporting service here
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h2>Oops! Terjadi Kesalahan</h2>
            <p>Maaf, terjadi error yang tidak terduga. Silakan refresh halaman atau hubungi administrator.</p>
            
            <div className="error-actions">
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                <i className="bi bi-arrow-clockwise"></i>
                Refresh Halaman
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              >
                <i className="bi bi-arrow-left"></i>
                Coba Lagi
              </button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Detail Error (Development)</summary>
                <div className="error-stack">
                  <h4>Error:</h4>
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  
                  <h4>Stack Trace:</h4>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;