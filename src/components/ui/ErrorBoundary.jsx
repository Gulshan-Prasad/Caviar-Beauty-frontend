import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen flex flex-col items-center justify-center text-center">
          <p className="section-subtitle">Something went wrong</p>
          <h1 className="section-title mt-3">An unexpected error occurred</h1>
          <div className="w-16 h-[1px] bg-gold-500 mt-6" />
          <p className="text-sm text-caviar-500 mt-6 max-w-md">
            Please try refreshing the page. If the problem persists, contact support.
          </p>
          <div className="mt-8 flex items-center space-x-4">
            <button onClick={this.handleReset} className="btn-primary text-xs">Try Again</button>
            <Link to="/" className="btn-secondary text-xs">Go Home</Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}