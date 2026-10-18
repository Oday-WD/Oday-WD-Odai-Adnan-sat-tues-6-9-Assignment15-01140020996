import { useEffect, useRef, useState, type ReactNode } from "react";
import EmojiPicker, {
  EmojiStyle,
  SkinTonePickerLocation,
  SkinTones,
  SuggestionMode,
  Theme,
  type EmojiClickData,
} from "emoji-picker-react";

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
  buttonClassName: string;
  children: ReactNode;
  popoverPosition?: "top" | "bottom";
}

export const EmojiPickerButton = ({
  onEmojiSelect,
  buttonClassName,
  children,
  popoverPosition = "bottom",
}: EmojiPickerButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function onClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  function onEmojiClick(emojiData: EmojiClickData) {
    onEmojiSelect(emojiData.emoji);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label="Add emoji"
        onClick={() => setIsOpen((prev) => !prev)}
        className={buttonClassName}
      >
        {children}
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 z-50 ${
            popoverPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            emojiStyle={EmojiStyle.NATIVE}
            theme={Theme.LIGHT}
            width={316}
            height={435}
            autoFocusSearch={false}
            lazyLoadEmojis={false}
            previewConfig={{ showPreview: false }}
            suggestedEmojisMode={SuggestionMode.RECENT}
            skinTonePickerLocation={SkinTonePickerLocation.SEARCH}
            defaultSkinTone={SkinTones.NEUTRAL}
          />
        </div>
      )}
    </div>
  );
};
