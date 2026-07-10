import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <title>Page Not Found | Elbo Tours</title>
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'sans-serif',
        background: '#FAF9F6',
        color: '#1a0d00',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center'
      }}>
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 1rem', color: '#C8960C' }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem' }}>Page Not Found</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>We could not find the page or tour you are looking for.</p>
          <Link 
            href="/en" 
            style={{ 
              background: '#C8960C', 
              color: '#fff', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Go to Homepage
          </Link>
        </div>
      </body>
    </html>
  );
}