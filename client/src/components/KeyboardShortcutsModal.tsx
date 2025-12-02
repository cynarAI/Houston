import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    {
      category: 'General',
      items: [
        { keys: [`${modKey}`, 'K'], description: 'Focus search / Command palette' },
        { keys: [`${modKey}`, 'N'], description: 'Create new item (context-dependent)' },
        { keys: [`${modKey}`, '/'], description: 'Show keyboard shortcuts' },
        { keys: ['Esc'], description: 'Close modal / Clear focus' },
      ],
    },
    {
      category: 'Navigation',
      items: [
        { keys: ['G', 'H'], description: 'Go to Home (Dashboard)' },
        { keys: ['G', 'C'], description: 'Go to Coach (Chat)' },
        { keys: ['G', 'G'], description: 'Go to Goals' },
        { keys: ['G', 'T'], description: 'Go to Tasks' },
        { keys: ['G', 'S'], description: 'Go to Settings' },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <span className="text-base text-gray-300">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-200 bg-white/10 border border-white/20 rounded">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-gray-500 text-sm">then</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-sm text-gray-400">
            Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-200 bg-white/10 border border-white/20 rounded">{modKey}</kbd> + <kbd className="px-2 py-1 text-xs font-semibold text-gray-200 bg-white/10 border border-white/20 rounded">/</kbd> anytime to view this help.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
