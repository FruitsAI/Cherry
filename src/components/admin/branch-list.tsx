/**
 * 🍒 Cherry Admin - 分支列表组件
 *
 * 可拖拽排序的分支列表，使用 @dnd-kit 库实现。
 * 支持增删改查操作。
 *
 * @file src/components/admin/branch-list.tsx
 *
 * @description
 * 功能：
 * - 拖拽排序（自动保存）
 * - 新增分支（通过 BranchFormDialog）
 * - 编辑分支
 * - 删除分支（带确认弹窗）
 */
"use client";

import { useState, useEffect, memo } from "react";
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
import { IconDisplay } from "@/components/ui/icon-display";
import { reorderBranches, deleteBranch } from "@/app/admin/branches/actions";
import { BranchFormDialog } from "./branch-form-dialog";
import { ConfirmModal } from "@/components/ui/confirm-modal";

/**
 * 可排序的分支项组件
 *
 * 使用 memo 优化渲染性能
 */
const SortableItem = memo(function SortableItem({ branch, onDelete, onEdit }: { branch: any; onDelete: (id: number) => void; onEdit: (branch: any) => void }) {
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
      className={`group flex items-center justify-between p-4 bg-[var(--cherry-bg-secondary)]/40 border ${isDragging ? "border-[var(--cherry-red)]" : "border-[var(--cherry-green)]/30"} rounded mb-2 hover:border-[var(--cherry-green)] transition-colors`}
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
});

export function BranchList({ initialBranches }: { initialBranches: any[] }) {
  const [branches, setBranches] = useState(initialBranches);
  const [isClient, setIsClient] = useState(false);

  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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

  const handleDeleteClick = (id: number) => {
      setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
        try {
            await deleteBranch(deleteId);
            setDeleteId(null);
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
                onDelete={handleDeleteClick} 
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

      <ConfirmModal
        isOpen={!!deleteId}
        title="DELETE BRANCH"
        message="Are you sure? This action cannot be undone if the branch contains links. All associated links might be lost or moved to default."
        confirmText="CONFIRM DELETE"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
