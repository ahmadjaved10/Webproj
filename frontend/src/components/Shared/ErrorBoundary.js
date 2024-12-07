import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };  // Update state to show fallback UI
  }

  componentDidCatch(error, info) {
    console.log("Error caught in ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI for error
      return <h2>Something went wrong. Please try again later.</h2>;
    }

    return this.props.children;  // Render children components if no error
  }
}

export default ErrorBoundary;
