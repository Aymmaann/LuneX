import { useEffect } from 'react';
import AuthService from './auth';

const loadGoogleScript = () => {
  // Load the Google API Client SDK script
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
  
  return script;
};

export const useGoogleAuth = (clientId, onSuccess, onError) => {
  useEffect(() => {
    const script = loadGoogleScript();
    
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.GOOGLE_CLIENT_ID, 
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    };
    
    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, [clientId, onSuccess, onError]);
  
  const handleGoogleResponse = async (response) => {
    try {
      if (response.credential) {
        // Send the token to our backend
        const authResponse = await AuthService.googleSignIn(response.credential);
        if (onSuccess) onSuccess(authResponse);
      }
    } catch (error) {
      if (onError) onError(error);
    }
  };
  
  const renderGoogleButton = (elementId) => {
    if (window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        { 
          theme: 'outline', 
          size: 'large',
          type: 'standard'
        }
      );
    }
  };
  
  return { renderGoogleButton };
};