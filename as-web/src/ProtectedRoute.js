import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/accounts/session/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setAllowed(true);
        } else {
          navigate('/');
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setChecking(false));
  }, [navigate]);

  if (checking) return <div>Loading...</div>;
  return allowed ? children : null;
}