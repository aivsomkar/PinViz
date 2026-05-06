import { FrostPanel } from './ui/FrostPanel';
import { useViewStore } from '../store/viewStore';
import { usePhotoStore } from '../store/photoStore';

export function SpaceHud() {
  const setView = useViewStore((s) => s.setView);
  const photos = usePhotoStore((s) => s.photos);
  const clear = usePhotoStore((s) => s.clear);

  const onClear = () => {
    clear();
    setView('landing');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 24,
        left: 24,
        zIndex: 10,
        display: 'flex',
        gap: 12,
      }}
    >
      <FrostPanel style={{ padding: '8px 14px' }}>
        <button
          onClick={onClear}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-grey-100)',
            fontSize: 'var(--font-size-md)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          ← New space
        </button>
      </FrostPanel>
      <FrostPanel style={{ padding: '8px 14px' }}>
        <span
          style={{
            fontSize: 'var(--font-size-md)',
            color: 'var(--color-grey-300)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
        </span>
      </FrostPanel>
    </div>
  );
}
