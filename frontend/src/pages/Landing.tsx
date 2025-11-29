import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Landing() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Navigation */}
      <nav style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1a1a1a',
          letterSpacing: '-0.5px'
        }}>
          DynoForm
        </div>
        <Link
          to="/login"
          style={{
            padding: '10px 24px',
            background: '#1a1a1a',
            color: 'white',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500',
            borderRadius: '6px'
          }}
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '24px',
          lineHeight: '1.1',
          letterSpacing: '-1px'
        }}>
          Build Dynamic Forms<br />Connected to Airtable
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#666',
          marginBottom: '40px',
          maxWidth: '700px',
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          Create beautiful forms in minutes, sync submissions directly to your Airtable bases, 
          and manage everything from one simple dashboard.
        </p>
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: '#1a1a1a',
            color: 'white',
            textDecoration: 'none',
            fontSize: '17px',
            fontWeight: '600',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          Get Started for Free
        </Link>
      </section>

      {/* Features */}
      <section style={{
        background: '#fafafa',
        padding: '80px 40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: '60px',
            letterSpacing: '-0.5px'
          }}>
            Everything you need
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#1a1a1a',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '28px'
              }}>
                🔗
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '12px'
              }}>
                Airtable Integration
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#666',
                lineHeight: '1.6'
              }}>
                Connect seamlessly with your Airtable bases. All form submissions sync automatically to your tables.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#1a1a1a',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '28px'
              }}>
                ⚡
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '12px'
              }}>
                Quick Setup
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#666',
                lineHeight: '1.6'
              }}>
                Create forms in minutes. Select your base, choose fields, and you're done. No coding required.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#1a1a1a',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '28px'
              }}>
                🎯
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '12px'
              }}>
                Smart Logic
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#666',
                lineHeight: '1.6'
              }}>
                Add conditional logic to show or hide fields based on user responses for better experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: '80px 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#1a1a1a',
          textAlign: 'center',
          marginBottom: '60px',
          letterSpacing: '-0.5px'
        }}>
          How it works
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px'
        }}>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#1a1a1a',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              1
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '10px'
            }}>
              Connect Airtable
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              Sign in and connect your Airtable account securely using OAuth.
            </p>
          </div>

          <div>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#1a1a1a',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              2
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '10px'
            }}>
              Create Your Form
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              Select a base and table, choose which fields to include in your form.
            </p>
          </div>

          <div>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#1a1a1a',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              3
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '10px'
            }}>
              Share & Collect
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              Share your form link and watch responses flow into your Airtable base.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: '#1a1a1a',
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '20px',
          letterSpacing: '-0.5px'
        }}>
          Ready to get started?
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#ccc',
          marginBottom: '32px',
          maxWidth: '600px',
          margin: '0 auto 32px'
        }}>
          Connect with Airtable and create your first form in under 5 minutes.
        </p>
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: 'white',
            color: '#1a1a1a',
            textDecoration: 'none',
            fontSize: '17px',
            fontWeight: '600',
            borderRadius: '8px'
          }}
        >
          Start Building Forms
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        textAlign: 'center',
        borderTop: '1px solid #e5e7eb',
        color: '#999',
        fontSize: '14px'
      }}>
        <p>© 2025 DynoForm. All rights reserved.</p>
      </footer>
    </div>
  );
}
