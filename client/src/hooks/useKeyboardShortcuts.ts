import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Global keyboard shortcuts hook
 * 
 * Shortcuts:
 * - Cmd+K: Focus search / Command palette
 * - Cmd+N: New goal / New task (context-dependent)
 * - Cmd+/: Show keyboard shortcuts help modal
 * - Esc: Close modals / Clear focus
 * - G then H: Go to Home
 * - G then C: Go to Coach
 * - G then G: Go to Goals
 * - G then T: Go to Tasks
 * - G then S: Go to Settings
 */

interface UseKeyboardShortcutsOptions {
  onShowHelp?: () => void;
  onNewItem?: () => void;
  onFocusSearch?: () => void;
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    let gPressed = false;
    let gPressedTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Ignore shortcuts when typing in input fields
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Cmd+K: Focus search
      if (modKey && e.key === 'k') {
        e.preventDefault();
        options.onFocusSearch?.();
        return;
      }

      // Cmd+N: New item (context-dependent)
      if (modKey && e.key === 'n') {
        e.preventDefault();
        options.onNewItem?.();
        return;
      }

      // Cmd+/: Show keyboard shortcuts help
      if (modKey && e.key === '/') {
        e.preventDefault();
        options.onShowHelp?.();
        return;
      }

      // Esc: Close modals / Clear focus
      if (e.key === 'Escape') {
        // Let modals handle their own escape logic
        // Just blur active element
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        return;
      }

      // Don't handle navigation shortcuts when typing
      if (isInput) return;

      // G key: Start navigation sequence
      if (e.key === 'g' || e.key === 'G') {
        if (!gPressed) {
          gPressed = true;
          // Reset after 1 second
          gPressedTimeout = setTimeout(() => {
            gPressed = false;
          }, 1000);
        } else {
          // G pressed twice: Go to Goals
          clearTimeout(gPressedTimeout);
          gPressed = false;
          setLocation('/app/goals');
        }
        return;
      }

      // Navigation shortcuts (after G)
      if (gPressed) {
        clearTimeout(gPressedTimeout);
        gPressed = false;

        switch (e.key.toLowerCase()) {
          case 'h':
            setLocation('/app/dashboard');
            break;
          case 'c':
            setLocation('/app/chats');
            break;
          case 't':
            setLocation('/app/todos');
            break;
          case 's':
            setLocation('/app/settings');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gPressedTimeout) clearTimeout(gPressedTimeout);
    };
  }, [setLocation, options]);
}
