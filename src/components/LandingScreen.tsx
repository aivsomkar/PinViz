import { useCallback, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { FrostPanel } from './ui/FrostPanel';
import { useViewStore } from '../store/viewStore';
import { usePhotoStore } from '../store/photoStore';
import { loadPhoto } from '../lib/loadPhoto';

const ACCEPTED = /\.(jpe?g)$/i;

export function LandingScreen() {
  const setView = useViewStore((s) => s.setView);
  const setProgress = useViewStore((s) => s.setProgress);
  const setPhotos = usePhotoStore((s) => s.setPhotos);
  const [dragOver, setDragOver] = useState(false);

  const ingest = useCallback(
    async (files: File[]) => {
      const jpgs = files.filter((f) => ACCEPTED.test(f.name));
      if (jpgs.length === 0) return;

      setProgress(0, jpgs.length);
      setView('processing');

      const out: Awaited<ReturnType<typeof loadPhoto>>[] = [];
      for (let i = 0; i < jpgs.length; i++) {
        try {
          const photo = await loadPhoto(jpgs[i]);
          out.push(photo);
        } catch (err) {
          console.warn(`Skipping ${jpgs[i].name}:`, err);
        }
        setProgress(i + 1, jpgs.length);
      }

      setPhotos(out);
      setView('space');
    },
    [setView, setProgress, setPhotos],
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const items = e.dataTransfer.files;
      ingest(Array.from(items));
    },
    [ingest],
  );

  const onPick = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      ingest(Array.from(files));
    },
    [ingest],
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 px-6">
      <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
        <h1
          style={{
            fontSize: 'var(--font-size-hero-large)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          TripTrace
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-grey-300)',
            maxWidth: 520,
          }}
        >
          Drop your trip photos and watch them come alive in a 3D space.
        </p>
      </div>

      <FrostPanel
        style={{
          width: 'min(560px, 90vw)',
          padding: '48px 32px',
          textAlign: 'center',
          borderStyle: 'dashed',
          borderColor: dragOver ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.18)',
          transition: `border-color var(--duration-color) var(--ease-translate)`,
        }}
      >
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          style={{ display: 'block', cursor: 'pointer' }}
        >
          <input
            type="file"
            multiple
            accept="image/jpeg,.jpg,.jpeg"
            onChange={onPick}
            style={{ display: 'none' }}
          />
          <div
            style={{
              fontSize: 'var(--font-size-xl)',
              color: 'var(--color-grey-100)',
              marginBottom: 8,
            }}
          >
            Drop your photos here
          </div>
          <div
            style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--color-grey-400)',
              lineHeight: 1.5,
            }}
          >
            JPG/JPEG only for now. Click to choose files. Works entirely in your browser —
            your photos never leave your device.
          </div>
        </label>
      </FrostPanel>
    </div>
  );
}
