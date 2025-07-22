import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import { SavedNameData } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableNameItem({
  name,
  onNameClick,
}: {
  name: SavedNameData;
  onNameClick: (name: SavedNameData) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: name.id || name.firstName });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 w-full ${
        isDragging ? "opacity-50 z-50" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded flex-shrink-0"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      <Badge
        variant="secondary"
        className="text-sm py-1 px-3 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors flex-1"
        onClick={() => onNameClick(name)}
      >
        {typeof name.rank === "number" ? name.rank + 1 : null}. {name.firstName}{" "}
        {name.lastName}
      </Badge>
    </div>
  );
}
