"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useUpdateImage } from "@/lib/api/hooks/use-images";
import type { ProductImage } from "@/lib/api/types";

interface ImageEditModalProps {
  image: ProductImage | null;
  open: boolean;
  onClose: () => void;
  productId: number;
}

export default function ImageEditModal({
  image,
  open,
  onClose,
  productId,
}: ImageEditModalProps) {
  const [altText, setAltText] = useState("");
  const updateImage = useUpdateImage();

  // Pre-fill when image changes
  useEffect(() => {
    if (image) {
      setAltText(image.alt_text || "");
    }
  }, [image]);

  const handleSave = async () => {
    if (!image) return;

    try {
      await updateImage.mutateAsync({
        productId,
        id: image.id,
        alt_text: altText,
      });
      toast.success("Alt text updated");
      onClose();
    } catch {
      toast.error("Failed to update alt text");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Image">
      {image && (
        <div className="space-y-4">
          {/* Image preview */}
          {image.url && (
            <div className="flex justify-center">
              <img
                src={image.url}
                alt={image.alt_text || "Product image"}
                className="max-w-[300px] max-h-[300px] rounded-lg object-contain border border-gray-200"
              />
            </div>
          )}

          {/* Alt text input */}
          <Input
            id="alt_text"
            label="Alt Text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe this image..."
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              loading={updateImage.isPending}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
