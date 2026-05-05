import { SvgFilters } from './components/SvgFilters';
import { LandingScreen } from './components/LandingScreen';
import { useViewStore } from './store/viewStore';

export default function App() {
  const view = useViewStore((s) => s.view);

  return (
    <>
      <SvgFilters />
      {view === 'landing' && <LandingScreen />}
      {view === 'globe' && (
        <div className="w-full h-full flex items-center justify-center">
          <span style={{ color: 'var(--color-grey-400)' }}>Globe coming next…</span>
        </div>
      )}
    </>
  );
}
