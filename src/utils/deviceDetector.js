export const isMobile = () => {
  // Check if window is defined (browser environment)
  if (typeof window === 'undefined') return false;

  // Check if the userAgent includes mobile-specific keywords
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  // Check if it's a mobile device based on userAgent
  const isMobileDevice = mobileRegex.test(navigator.userAgent);
  
  // Also check screen width as a fallback
  const isMobileWidth = window.innerWidth <= 768;
  
  return isMobileDevice || isMobileWidth;
};

// Add event listener for window resize to handle orientation changes
let timeoutId = null;
export const addResizeListener = (callback) => {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('resize', () => {
    // Debounce the callback to prevent excessive updates
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback();
    }, 250);
  });

  // Return cleanup function
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    window.removeEventListener('resize', callback);
  };
}; 