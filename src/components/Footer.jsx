import React, { useContext } from 'react';
import translations from '../translations';
import { LanguageContext } from '../LanguageContext';

const Footer = () => {
  const { language } = useContext(LanguageContext);

  return (
    <footer>
      <p className='footercopy'>&copy;{translations[language].copyright}</p>
    </footer>
  );
};

export default Footer;
