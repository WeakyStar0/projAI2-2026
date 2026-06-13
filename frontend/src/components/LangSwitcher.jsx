import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LangSwitcher({ style = {} }) {
  const { i18n } = useTranslation();
  const isEN = i18n.language?.startsWith('en');

  const toggle = () => i18n.changeLanguage(isEN ? 'pt' : 'en');

  return (
    <button
      onClick={toggle}
      title={isEN ? 'Switch to Portuguese' : 'Switch to English'}
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '8px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.75rem',
        fontWeight: 700,
        padding: '0.3rem 0.6rem',
        cursor: 'pointer',
        letterSpacing: '0.05em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        transition: 'all .15s',
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.color = 'white'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
    >
      {isEN ? '🇵🇹 PT' : '🇬🇧 EN'}
    </button>
  );
}
