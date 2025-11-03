import { BellOff } from 'lucide-react';
import { Switch } from './ui/switch';

interface AutomationSectionProps {
  isDndActive: boolean;
  onToggleDnd: () => void;
  isDarkMode: boolean;
}

export function AutomationSection({
  isDndActive,
  onToggleDnd,
  isDarkMode
}: AutomationSectionProps) {
  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: '22px', fontWeight: 700 }}>Automation</h2>
      
      <div className="space-y-3">
        {/* DND Toggle */}
        <div className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${
          isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'
        }`}>
          <div className="flex items-center gap-3 flex-1 mr-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
              isDarkMode ? 'bg-white/10' : 'bg-black/10'
            }`}>
              <BellOff className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div style={{ fontSize: '17px', fontWeight: 600 }}>Do Not Disturb</div>
              <div 
                className={`${isDarkMode ? 'text-white/50' : 'text-black/50'}`}
                style={{ fontSize: '13px' }}
              >
                Silence notifications during focus
              </div>
            </div>
          </div>
          <div className="flex items-center h-[44px]">
            <Switch
              checked={isDndActive}
              onCheckedChange={onToggleDnd}
              aria-label="Toggle Do Not Disturb"
              className={`${
                isDarkMode
                  ? 'data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20'
                  : 'data-[state=checked]:bg-black data-[state=unchecked]:bg-black/20'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Info text */}
      <p 
        className={`mt-3 px-4 ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}
        style={{ fontSize: '13px' }}
      >
        Note: Actual system DND control requires native app permissions
      </p>
    </div>
  );
}
