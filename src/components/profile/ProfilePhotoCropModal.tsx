import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Spinner } from "@heroui/react";
import type { Post } from "../../interfaces/post";

const BOX = 320;
const OUTPUT = 512; 

interface ProfilePhotoCropModalProps {
  file: File;
  isPending: boolean;
  onSave: (croppedFile: File, privacy: Post["privacy"]) => void;
  onClose: () => void;
}

export const ProfilePhotoCropModal = ({
  file,
  isPending,
  onSave,
  onClose,
}: ProfilePhotoCropModalProps) => {
  const [src, setSrc] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [privacy, setPrivacy] = useState<Post["privacy"]>("public");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isPending) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, isPending]);

  const baseScale = size.w ? BOX / Math.min(size.w, size.h) : 1;
  const scale = baseScale * zoom;

  function clamp(x: number, y: number, currentScale = scale) {
    const maxX = Math.max(0, (size.w * currentScale - BOX) / 2);
    const maxY = Math.max(0, (size.h * currentScale - BOX) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }

  function onImageLoad() {
    const img = imgRef.current;
    if (img) setSize({ w: img.naturalWidth, h: img.naturalHeight });
  }

  function onZoomChange(value: number) {
    setZoom(value);
    setOffset((prev) => clamp(prev.x, prev.y, baseScale * value));
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    setOffset(
      clamp(e.clientX - dragRef.current.x, e.clientY - dragRef.current.y),
    );
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function saveHandler() {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sourceSize = BOX / scale;
    const sx = size.w / 2 - offset.x / scale - sourceSize / 2;
    const sy = size.h / 2 - offset.y / scale - sourceSize / 2;
    ctx.drawImage(img, sx, sy, sourceSize, sourceSize, 0, 0, OUTPUT, OUTPUT);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
        onSave(new File([blob], name, { type: "image/jpeg" }), privacy);
      },
      "image/jpeg",
      0.92,
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-140 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
        <div className="mb-3">
          <h3 className="text-lg font-extrabold text-slate-900">
            Adjust profile photo
          </h3>
          <p className="text-sm text-slate-500">
            Drag to reposition and use zoom for perfect framing.
          </p>
        </div>

        {/* Crop area */}
        <div className="mx-auto w-full max-w-85 overflow-x-auto pb-1">
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative h-80 w-80 cursor-grab touch-none overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 active:cursor-grabbing"
          >
            {src && (
              <img
                ref={imgRef}
                alt="Crop preview"
                draggable={false}
                onLoad={onImageLoad}
                className="pointer-events-none absolute left-1/2 top-1/2 select-none"
                src={src}
                style={{
                  width: size.w || undefined,
                  height: size.h || undefined,
                  maxWidth: "none",
                  maxHeight: "none",
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
                  transformOrigin: "center center",
                }}
              />
            )}
          </div>
        </div>

        {/* Zoom */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Zoom</span>
            <span>{zoom.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#1877f2]"
          />
        </div>

        {/* Privacy */}
        <div className="mt-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Post privacy
          </p>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as Post["privacy"])}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#1877f2]"
          >
            <option value="public">Public</option>
            <option value="following">Followers</option>
            <option value="only_me">Only me</option>
          </select>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <Button
            type="button"
            onPress={saveHandler}
            isDisabled={isPending || !size.w}
            className="inline-flex items-center rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <Spinner color="current" size="sm" /> : "Save photo"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
