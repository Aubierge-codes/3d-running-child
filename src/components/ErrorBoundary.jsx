import { Component } from 'react'

// Catches render errors from the 3D scene (no WebGL support, the character
// model failing to load, a crash inside a component) and shows a readable
// message instead of a blank page. The original error is logged to the console.
class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[3D world] Scene failed to render:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2000,
        background: '#0a1a0a', color: 'white', fontFamily: "'Segoe UI', sans-serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px', textAlign: 'center', gap: '12px',
      }}>
        <div style={{ fontSize: '24px', fontWeight: 700 }}>The 3D world couldn't start</div>
        <div style={{ fontSize: '14px', opacity: 0.8, maxWidth: '420px' }}>
          Your browser may not support WebGL, or a game file failed to load.
          Try reloading, or open the page in an up-to-date Chrome, Edge, Firefox or Safari.
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '8px', padding: '10px 24px', fontSize: '15px', fontWeight: 600,
            background: '#4ade80', color: '#0a1a0a', border: 'none', borderRadius: '10px', cursor: 'pointer',
          }}
        >
          Reload
        </button>
      </div>
    )
  }
}

export default ErrorBoundary
