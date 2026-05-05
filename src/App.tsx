import { SvgFilters } from './components/SvgFilters';
import { LandingScreen } from './components/LandingScreen';
import { GlobeScene } from './components/GlobeScene';
import { useViewStore } from './store/viewStore';

export default function App() {
  const view = useViewStore((s) => s.view);

  return (
    <>
      <SvgFilters />
      {view === 'landing' && <LandingScreen />}
      {view === 'globe' && <GlobeScene />}
    </>
  );
}
