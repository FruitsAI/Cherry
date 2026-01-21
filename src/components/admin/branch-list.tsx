"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconDisplay } from "@/components/ui/IconDisplay";
import { reorderBranches, deleteBranch } from "@/app/admin/branches/actions";
import { BranchFormDialog } from "./branch-form-dialog";

// Sortable Item Component
function SortableItem({ branch, onDelete, onEdit }: { branch: any; onDelete: (id: number) => void; onEdit: (branch: any) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: branch.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 bg-black/40 border ${isDragging ? "border-[var(--cherry-red)]" : "border-[var(--cherry-green)]/30"} rounded mb-2 hover:border-[var(--cherry-green)] transition-colors`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-[var(--cherry-green)] text-[var(--cherry-muted)] px-2"
        >
          ⋮⋮
        </div>

        {/* Icon & Name */}
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-[var(--cherry-green)]/10 rounded border border-[var(--cherry-green)]/20 text-lg">
                 {branch.icon.startsWith("pixels/") ? (
                    <IconDisplay icon={branch.icon} className="w-5 h-5" />
                 ) : (
                    <span>{branch.icon}</span>
                 )}
            </div>
            <span className="font-pixel text-lg">{branch.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
            onClick={() => onEdit(branch)}
            className="px-3 py-1 text-sm border border-[var(--cherry-amber)]/50 text-[var(--cherry-amber)] hover:bg-[var(--cherry-amber)] hover:text-white rounded transition-colors"
        >
            Edit
        </button>
        <button
          onClick={() => onDelete(branch.id)}
          className="px-3 py-1 text-sm border border-[var(--cherry-red)]/50 text-[var(--cherry-red)] hover:bg-[var(--cherry-red)] hover:text-white rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function BranchList({ initialBranches }: { initialBranches: any[] }) {
  const [branches, setBranches] = useState(initialBranches);
  const [isClient, setIsClient] = useState(false);

  const [editingBranch, setEditingBranch] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    setBranches(initialBranches);
  }, [initialBranches]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBranches((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Optimistic UI update
        // Trigger server action to save order
        reorderBranches(newItems.map((item, index) => ({ id: item.id, sortOrder: index })));

        return newItems;
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure? This action cannot be undone if the category contains links.")) {
        try {
            await deleteBranch(id);
        } catch (error: any) {
            alert(error.message);
        }
    }
  };

  if (!isClient) return null;

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <BranchFormDialog />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={branches.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {branches.map((branch) => (
            <SortableItem 
                key={branch.id} 
                branch={branch} 
                onDelete={handleDelete} 
                onEdit={(b) => setEditingBranch(b)} // Open dialog with branch
            /> 
          ))}
        </SortableContext>
      </DndContext>
      
      {/* Edit Dialog */}
      {editingBranch && (
          <BranchFormDialog 
            branch={editingBranch} 
            open={!!editingBranch} 
            onOpenChange={(open: boolean) => !open && setEditingBranch(null)} 
          />
      )}
    </div>
  );
}
