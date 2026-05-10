import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from './LanguageContext';

describe('LanguageContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document attributes
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('lang');
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('LanguageProvider initialization', () => {
    it('should initialize with English as default language', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      expect(result.current.language).toBe('en');
      expect(result.current.isRTL).toBe(false);
    });

    it('should load saved language from localStorage', () => {
      localStorage.setItem('aqar_language', 'ar');

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      expect(result.current.language).toBe('ar');
      expect(result.current.isRTL).toBe(true);
    });

    it('should set dir attribute on document root on mount', () => {
      renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      expect(document.documentElement.getAttribute('dir')).toBe('ltr');
      expect(document.documentElement.getAttribute('lang')).toBe('en');
    });

    it('should set RTL dir attribute when Arabic is saved', () => {
      localStorage.setItem('aqar_language', 'ar');

      renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      expect(document.documentElement.getAttribute('dir')).toBe('rtl');
      expect(document.documentElement.getAttribute('lang')).toBe('ar');
    });
  });

  describe('toggleLanguage', () => {
    it('should toggle from English to Arabic', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      act(() => {
        result.current.toggleLanguage();
      });

      expect(result.current.language).toBe('ar');
      expect(result.current.isRTL).toBe(true);
      expect(localStorage.getItem('aqar_language')).toBe('ar');
      expect(document.documentElement.getAttribute('dir')).toBe('rtl');
      expect(document.documentElement.getAttribute('lang')).toBe('ar');
    });

    it('should toggle from Arabic to English', () => {
      localStorage.setItem('aqar_language', 'ar');

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      act(() => {
        result.current.toggleLanguage();
      });

      expect(result.current.language).toBe('en');
      expect(result.current.isRTL).toBe(false);
      expect(localStorage.getItem('aqar_language')).toBe('en');
      expect(document.documentElement.getAttribute('dir')).toBe('ltr');
      expect(document.documentElement.getAttribute('lang')).toBe('en');
    });

    it('should toggle multiple times correctly', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      // Toggle to Arabic
      act(() => {
        result.current.toggleLanguage();
      });
      expect(result.current.language).toBe('ar');

      // Toggle back to English
      act(() => {
        result.current.toggleLanguage();
      });
      expect(result.current.language).toBe('en');

      // Toggle to Arabic again
      act(() => {
        result.current.toggleLanguage();
      });
      expect(result.current.language).toBe('ar');
    });
  });

  describe('setLanguage', () => {
    it('should set language to Arabic', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      act(() => {
        result.current.setLanguage('ar');
      });

      expect(result.current.language).toBe('ar');
      expect(result.current.isRTL).toBe(true);
      expect(localStorage.getItem('aqar_language')).toBe('ar');
      expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    });

    it('should set language to English', () => {
      localStorage.setItem('aqar_language', 'ar');

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      act(() => {
        result.current.setLanguage('en');
      });

      expect(result.current.language).toBe('en');
      expect(result.current.isRTL).toBe(false);
      expect(localStorage.getItem('aqar_language')).toBe('en');
      expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    });

    it('should warn and not change language for invalid input', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      const initialLanguage = result.current.language;

      act(() => {
        result.current.setLanguage('fr'); // Invalid language
      });

      expect(result.current.language).toBe(initialLanguage);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid language. Use "en" or "ar".');

      consoleWarnSpy.mockRestore();
    });
  });

  describe('localStorage persistence', () => {
    it('should persist language preference across re-renders', () => {
      const { result, rerender } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      act(() => {
        result.current.setLanguage('ar');
      });

      rerender();

      expect(result.current.language).toBe('ar');
      expect(localStorage.getItem('aqar_language')).toBe('ar');
    });

    it('should load persisted language on new mount', () => {
      // First mount - set to Arabic
      const { result: result1 } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      act(() => {
        result1.current.setLanguage('ar');
      });

      // Simulate unmount and remount by creating new hook
      const { result: result2 } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      expect(result2.current.language).toBe('ar');
      expect(result2.current.isRTL).toBe(true);
    });
  });

  describe('useLanguage hook', () => {
    it('should throw error when used outside LanguageProvider', () => {
      // Suppress console.error for this test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useLanguage());
      }).toThrow('useLanguage must be used within LanguageProvider');

      consoleErrorSpy.mockRestore();
    });

    it('should provide all context values', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      expect(result.current).toHaveProperty('language');
      expect(result.current).toHaveProperty('isRTL');
      expect(result.current).toHaveProperty('toggleLanguage');
      expect(result.current).toHaveProperty('setLanguage');
      expect(typeof result.current.toggleLanguage).toBe('function');
      expect(typeof result.current.setLanguage).toBe('function');
    });
  });

  describe('Document attribute updates', () => {
    it('should update dir and lang attributes when toggling', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      // Initial state
      expect(document.documentElement.getAttribute('dir')).toBe('ltr');
      expect(document.documentElement.getAttribute('lang')).toBe('en');

      // Toggle to Arabic
      act(() => {
        result.current.toggleLanguage();
      });

      expect(document.documentElement.getAttribute('dir')).toBe('rtl');
      expect(document.documentElement.getAttribute('lang')).toBe('ar');

      // Toggle back to English
      act(() => {
        result.current.toggleLanguage();
      });

      expect(document.documentElement.getAttribute('dir')).toBe('ltr');
      expect(document.documentElement.getAttribute('lang')).toBe('en');
    });
  });
});
