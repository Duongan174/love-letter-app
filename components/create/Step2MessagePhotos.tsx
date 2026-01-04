// components/create/Step2MessagePhotos.tsx
// Chỉ còn Step 3 (Message) - đã bỏ Step 4 (Photos)
'use client';

import Step3Message from './Step3Message';

interface Step2MessagePhotosProps {
  // Message props
  message: string;
  letterPages?: string[];
  onUpdateLetterPages?: (pages: string[]) => void;
  fontStyle: string;
  textEffect: string;
  letterBackground?: string;
  letterPattern?: string;
  letterContainerBackground?: string;
  stickers?: Array<{ id: string; x: number; y: number; width?: number; height?: number; sticker_id: string; image_url: string }>;
  signatureData?: string | null;
  userTym?: number;
  onUpdate: (data: {
    message?: string;
    richContent?: string | null;
    usedFonts?: string[];
    fontStyle?: string;
    textEffect?: string;
    letterBackground?: string;
    letterPattern?: string;
    letterContainerBackground?: string;
    stickers?: Array<{ id: string; x: number; y: number; width?: number; height?: number; sticker_id: string; image_url: string }>;
  }) => void;
  // Photos props (deprecated - giữ lại để backward compatibility nhưng không sử dụng)
  photos?: string[];
  onAddPhoto?: (photoUrl: string) => void;
  onRemovePhoto?: (index: number) => void;
  onUpdatePhotoTransform?: (index: number, transform: any) => void;
  photoTransforms?: Array<any | undefined>;
}

export default function Step2MessagePhotos({
  message,
  letterPages,
  onUpdateLetterPages,
  fontStyle,
  textEffect,
  letterBackground,
  letterPattern,
  letterContainerBackground,
  stickers,
  signatureData,
  userTym,
  onUpdate,
  // Photos props được giữ lại để không break existing code nhưng không sử dụng
  photos: _photos,
  onAddPhoto: _onAddPhoto,
  onRemovePhoto: _onRemovePhoto,
  onUpdatePhotoTransform: _onUpdatePhotoTransform,
  photoTransforms: _photoTransforms,
}: Step2MessagePhotosProps) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <Step3Message
        message={message}
        letterPages={letterPages}
        onUpdateLetterPages={onUpdateLetterPages}
        fontStyle={fontStyle}
        textEffect={textEffect}
        letterBackground={letterBackground}
        letterPattern={letterPattern}
        letterContainerBackground={letterContainerBackground}
        stickers={stickers}
        signatureData={signatureData}
        userTym={userTym}
        onUpdate={onUpdate}
      />
    </div>
  );
}
