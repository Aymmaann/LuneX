import { useEffect, useCallback } from 'react';
import AuthService from './auth';


const loadGoogleScript = () => {
  if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
    return document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
  }

  // Create and add script to document
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
  
  return script;
};

export const useGoogleAuth = (clientId, onSuccess, onError) => {
  // Handle Google Sign-In response
  const handleGoogleResponse = useCallback(async (response) => {
    try {
      if (response.credential) {
        // Send the token to our backend
        const authResponse = await AuthService.googleSignIn(response.credential);
        if (onSuccess) onSuccess(authResponse);
      }
    } catch (error) {
      if (onError) onError(error);
    }
  }, [onSuccess, onError]);

  // Initialize Google Sign-In on component mount
  useEffect(() => {
    // Don't proceed if client ID is not available
    if (!clientId) {
      console.error('Google Client ID is not provided');
      return;
    }

    const script = loadGoogleScript();
    let googleInitialized = false;
    
    const initializeGoogle = () => {
      if (window.google && !googleInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        googleInitialized = true;
      }
    };

    // Initialize when script is already loaded
    if (window.google) {
      initializeGoogle();
    } else {
      // Initialize when script loads
      script.onload = initializeGoogle;
    }
    
    // Cleanup function
    return () => {
      if (googleInitialized && window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [clientId, handleGoogleResponse]);
  
  // Render Google Sign-In button
  const renderGoogleButton = useCallback((elementId) => {
    if (window.google && document.getElementById(elementId)) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'filled_black', // Options: outline, filled_blue, filled_black
          size: 'large',         // Options: large, medium, small
          type: 'standard',      // Options: standard, icon
          text: 'continue_with', // Options: signin_with, signup_with, continue_with
          shape: 'rectangular',  // Options: rectangular, pill, circle, square
          logo_alignment: 'left',
          width: 300
        }
      );
    }
  }, []);
  
  // Return methods for component to use
  return { 
    renderGoogleButton,
    promptGoogleSignIn: () => {
      if (window.google) {
        window.google.accounts.id.prompt();
      }
    }
  };
};