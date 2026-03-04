"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ImageUploadProps {
  onFilesSelected: (files: File[]) => void;
  previews?: string[];
  onRemovePreview?: (index: number) => void;
}

export default function ImageUpload({ onFilesSelected, previews = [], onRemovePreview }: ImageUploadProps) {
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setLocalPreviews((prev) => [...prev, ...newPreviews]);
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: true,
  });

  const allPreviews = [...previews, ...localPreviews];

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <PhotoIcon className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? "Drop files here..." : "Drag & drop images, or click to select"}
        </p>
      </div>
      {allPreviews.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {allPreviews.map((src, idx) => (
            <div key={idx} className="relative group">
              <img src={src} alt={`Preview ${idx + 1}`} className="h-24 w-24 object-cover rounded-lg" />
              {onRemovePreview && (
                <button
                  onClick={() => onRemovePreview(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
