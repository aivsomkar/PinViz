import { SvgFilters } from './components/SvgFilters';
import { AuthGate } from './components/AuthGate';
import { LandingScreen } from './components/LandingScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { SpaceScene } from './components/SpaceScene';
import { SpaceHud } from './components/SpaceHud';
import { PhotoLightbox } from './components/PhotoLightbox';
import { useViewStore } from './store/viewStore';

export default function App() {
  const view = useViewStore((s) => s.view);

  return (
    <>
      <SvgFilters />
      <AuthGate>
        {view === 'landing' && <LandingScreen />}
        {view === 'processing' && <ProcessingScreen />}
        {view === 'space' && (
          <>
            <SpaceScene />
            <SpaceHud />
            <PhotoLightbox />
          </>
        )}
      </AuthGate>
    </>
  );
}
