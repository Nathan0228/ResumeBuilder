import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

function SortableItem({ id, label, onRemove, onClick, t }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs
        ${isDragging ? 'shadow-lg ring-2 ring-indigo-400 bg-white' : ''}
      `}
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 shrink-0"
        title={t('builder.dragToReorder')}
      >
        <GripVertical size={12} />
      </span>
      <button
        type="button"
        onClick={() => onClick && onClick(id)}
        className="select-none hover:text-indigo-600 transition-colors cursor-pointer"
        title={t('builder.clickToScroll')}
      >
        {label}
      </button>
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-red-500 ml-0.5"
        title={t('builder.removeBlock')}
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

export default function SortableBlockList({
  blockOrder,
  setBlockOrder,
  getLabel,
  onRemove,
  onClick,
  t,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blockOrder.indexOf(active.id);
      const newIndex = blockOrder.indexOf(over.id);
      setBlockOrder(arrayMove(blockOrder, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={blockOrder} strategy={verticalListSortingStrategy}>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {blockOrder.map((id) => (
            <SortableItem
              key={id}
              id={id}
              label={getLabel(id)}
              onRemove={onRemove}
              onClick={onClick}
              t={t}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
