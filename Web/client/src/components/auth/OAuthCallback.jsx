import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { USER_PROFILE_CONTEXT } from '@/context';
import { storeAuth } from '@/lib/util';
import { BASE_URL } from '@/config';
import toast from 'react-hot-toast';

export function OAuthCallback() {
  const navigate = useNavigate();
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        try {
          const response = await fetch(`${BASE_URL}/auth/google/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          const data = await response.json();

          if (response.ok) {
            storeAuth(data.token, "customer", true);
            setUserProfile(data.user);
            navigate('/dashboard');
            toast.success('Successfully logged in with Google!');
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          toast.error('Failed to complete authentication');
          navigate('/login');
        }
      } else {
        toast.error('Authentication failed');
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, setUserProfile]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
        <p className="text-gray-500">Please wait while we log you in.</p>
      </div>
    </div>
  );
} 