import React from 'react';

export const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, id: string) => {
  e.preventDefault();
  const targetId = id.replace('#', '');
  const element = document.getElementById(targetId);
  
  if (element) {
    const navbarHeight = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Update URL hash without jumping
    window.history.pushState(null, '', `#${targetId}`);
  }
};
