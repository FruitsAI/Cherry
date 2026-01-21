import { Hero } from '../features/home/Hero';
import { CommandInput } from '../features/search/CommandInput';
import { QuickLinks } from '../features/home/QuickLinks';
import { CherryData } from '../../types';

interface HomeViewProps {
  slogan: string;
  shortcuts: CherryData['site_config']['shortcuts'];
  branches: CherryData['branches'];
  isCommandInputActive: boolean;
  onCommand: (input: string) => void;
  onFocusSearch: () => void;
  onBlurSearch: () => void;
}

export function HomeView({
  slogan,
  shortcuts,
  branches,
  isCommandInputActive,
  onCommand,
  onFocusSearch,
  onBlurSearch,
}: HomeViewProps) {
  return (
    <div className="h-full flex flex-col items-center pb-28 pt-20 overflow-hidden">
      {/* Spacer 1 */}
      <div className="flex-1 min-h-[20px]" />

      <div className="flex-shrink-0 w-full max-w-2xl px-4 flex flex-col items-center">
        {/* Home View: Hero + Search */}
        <Hero slogan={slogan} />
        <div className="w-full mt-4">
          <CommandInput
            onCommand={onCommand}
            isActive={isCommandInputActive}
            onFocus={onFocusSearch}
            onBlur={onBlurSearch}
            branches={branches}
          />
        </div>
      </div>

      {/* Spacer 2 */}
      <div className="flex-1 min-h-[20px]" />

      {/* Shortcuts */}
      <div className="flex-shrink-0">
        <QuickLinks shortcuts={shortcuts} />
      </div>

      {/* Spacer 3 */}
      <div className="flex-1 min-h-[20px]" />
    </div>
  );
}
