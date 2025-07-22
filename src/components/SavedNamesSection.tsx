"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkCheck, User, Users } from "lucide-react";
import { SavedNameData, Gender } from "@/lib/types";
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
} from "@dnd-kit/sortable";
import SortableNameItem from "./SortableName";

interface SavedNamesSectionProps {
  savedNames: SavedNameData[];
  setSavedNames: (names: SavedNameData[]) => void;
  onNameClick: (name: SavedNameData) => void;
}

export default function SavedNamesSection({
  savedNames,
  setSavedNames,
  onNameClick,
}: SavedNamesSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (savedNames.length === 0) return null;

  const boyNames =
    savedNames.filter((name) => name.gender === Gender.MALE) || [];
  const girlNames =
    savedNames.filter((name) => name.gender === Gender.FEMALE) || [];

  const handleReorder = async (nameIds: string[], gender: Gender) => {
    const response = await fetch("/api/reorder-names", {
      method: "POST",
      body: JSON.stringify({ nameIds, gender }),
    });
  };

  const handleDragEnd = (
    event: DragEndEvent,
    names: SavedNameData[],
    gender: Gender
  ) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = names.findIndex(
        (name) => (name.id || name.firstName) === active.id
      );
      const newIndex = names.findIndex(
        (name) => (name.id || name.firstName) === over?.id
      );

      const reorderedNames = arrayMove(names, oldIndex, newIndex).map(
        (name, index) => ({
          ...name,
          rank: index,
        })
      );
      const nameIds = reorderedNames.map((name) => name.id || name.firstName);
      const otherNames = savedNames.filter((name) => name.gender !== gender);
      setSavedNames([...otherNames, ...reorderedNames]);

      handleReorder(nameIds, gender);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookmarkCheck className="h-5 w-5 text-green-500" />
          Your Saved Names
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Boy Names Section */}
        {boyNames.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold text-blue-700">Boy Names</h3>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, boyNames, Gender.MALE)}
            >
              <SortableContext
                items={boyNames.map((name) => name.id || name.firstName)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {boyNames.map((name: SavedNameData) => (
                    <SortableNameItem
                      key={name.id || name.firstName}
                      name={name}
                      onNameClick={onNameClick}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Girl Names Section */}
        {girlNames.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-pink-500" />
              <h3 className="font-semibold text-pink-700">Girl Names</h3>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) =>
                handleDragEnd(event, girlNames, Gender.FEMALE)
              }
            >
              <SortableContext
                items={girlNames.map((name) => name.id || name.firstName)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {girlNames.map((name: SavedNameData) => (
                    <SortableNameItem
                      key={name.id || name.firstName}
                      name={name}
                      onNameClick={onNameClick}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
