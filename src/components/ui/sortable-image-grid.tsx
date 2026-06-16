"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Bars3Icon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils/cn";
import { useUpdateImage } from "@/lib/api/hooks/use-images";
import type { ProductImage } from "@/lib/api/types";

interface SortableImageGridProps {
  images: ProductImage[];
  productId: number;
  onDelete: (imageId: number) => void;
  onEditAltText: (image: ProductImage) => void;
}

interface SortableImageCardProps {
  image: ProductImage;
  onDelete: (imageId: number) => void;
  onEditAltText: (image: ProductImage) => void;
}

function SortableImageCard({ image, onDelete, onEditAltText }: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white",
        isDragging && "opacity-50 shadow-lg ring-2 ring-indigo-500"
      )}
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100">
        {image.url ? (
          <img
            src={image.url}
            alt={image.alt_text || "Product image"}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Position badge - top left */}
      <div className="absolute top-2 left-2">
        {image.position === 0 ? (
          <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-300">
            1 &middot; PRINCIPAL
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-300">
            {image.position + 1}
          </span>
        )}
      </div>

      {/* Drag handle - top right, z-20 to stay above overlay */}
      <button
        type="button"
        className="absolute top-2 right-2 z-20 cursor-grab rounded-md bg-white/80 p-1 text-gray-500 shadow-sm hover:bg-white hover:text-gray-700 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <Bars3Icon className="h-4 w-4" />
      </button>

      {/* Hover overlay with actions - pointer-events-none so drag handle works */}
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <button
          type="button"
          onClick={() => onEditAltText(image)}
          className="rounded-md bg-white p-2 text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors pointer-events-auto"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(image.id)}
          className="rounded-md bg-white p-2 text-red-600 shadow-sm hover:bg-red-50 transition-colors pointer-events-auto"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Alt text label at bottom */}
      {image.alt_text && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
          <p className="text-xs text-white truncate">{image.alt_text}</p>
        </div>
      )}
    </div>
  );
}

export default function SortableImageGrid({
  images,
  productId,
  onDelete,
  onEditAltText,
}: SortableImageGridProps) {
  const updateImage = useUpdateImage();

  // Optimistic local state sorted by position
  const sortedImages = [...images].sort((a, b) => a.position - b.position);
  const [localImages, setLocalImages] = useState<ProductImage[]>(sortedImages);

  // Sync local state when images prop changes
  useEffect(() => {
    setLocalImages([...images].sort((a, b) => a.position - b.position));
  }, [images]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = localImages.findIndex((img) => img.id === active.id);
      const newIndex = localImages.findIndex((img) => img.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(localImages, oldIndex, newIndex);

      // Assign new positions
      const withPositions = reordered.map((img, index) => ({
        ...img,
        position: index,
      }));

      // Optimistic update
      setLocalImages(withPositions);

      // Find images whose position changed and update them
      const updates = withPositions.filter((img) => {
        const original = images.find((o) => o.id === img.id);
        return original && original.position !== img.position;
      });

      Promise.all(
        updates.map((img) =>
          updateImage.mutateAsync({
            productId,
            id: img.id,
            position: img.position,
          })
        )
      )
        .then(() => {
          toast.success("Image order updated");
        })
        .catch(() => {
          // Revert on error
          setLocalImages([...images].sort((a, b) => a.position - b.position));
          toast.error("Failed to update image order");
        });
    },
    [localImages, images, productId, updateImage]
  );

  if (localImages.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localImages.map((img) => img.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {localImages.map((image) => (
            <SortableImageCard
              key={image.id}
              image={image}
              onDelete={onDelete}
              onEditAltText={onEditAltText}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
