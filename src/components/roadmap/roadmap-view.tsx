import { useState, useRef, useCallback, useMemo, useLayoutEffect } from "react";
import type { Task } from "@/types";
import { TaskCard } from "./task-card";
import { mockTasks as initialMockTasks } from "@/mocks/data";
import {
  calculateTaskColumns,
  groupTasksByColumn,
  calculateDependencyLines,
  getMinColumnForTask,
  getMaxColumnForTask,
} from "@/lib/graph";
import { LayoutGrid, List, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "graph" | "list";

// Types for drag and drop
interface DropTarget {
  column: number;
  index: number;
  isValid: boolean;
}

interface ColumnBounds {
  column: number;
  left: number;
  right: number;
  taskBounds: Array<{
    taskId: string;
    top: number;
    bottom: number;
    midY: number;
  }>;
}

export function RoadmapView() {
  const [viewMode, setViewMode] = useState<ViewMode>("graph");
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>(initialMockTasks);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter tasks based on search
  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, tasks]);

  // Calculate columns from dependencies
  const taskColumns = useMemo(
    () => calculateTaskColumns(filteredTasks),
    [filteredTasks],
  );

  // Group tasks by column
  const columnGroups = useMemo(
    () => groupTasksByColumn(filteredTasks, taskColumns),
    [filteredTasks, taskColumns],
  );

  // Calculate dependency lines
  const dependencyLines = useMemo(
    () => calculateDependencyLines(filteredTasks, taskColumns),
    [filteredTasks, taskColumns],
  );

  const columns = Array.from(columnGroups.entries()).sort(([a], [b]) => a - b);
  const maxColumn = columns.length > 0 ? columns[columns.length - 1][0] : 0;

  const handleTaskSelect = useCallback((taskId: string) => {
    setSelectedTaskId((prev) => (prev === taskId ? undefined : taskId));
  }, []);

  // Handle task move (vertical reorder or column change)
  const handleTaskMove = useCallback(
    (taskId: string, targetColumn: number, targetIndex: number) => {
      setTasks((prevTasks) => {
        // Check if move is valid
        const minCol = getMinColumnForTask(taskId, prevTasks);
        const currentColumns = calculateTaskColumns(prevTasks);
        const maxCol = getMaxColumnForTask(taskId, prevTasks, currentColumns);

        if (targetColumn < minCol || targetColumn > maxCol) {
          console.warn(
            `Cannot move task to column ${targetColumn}. Valid range: ${minCol}-${maxCol}`,
          );
          return prevTasks;
        }

        return prevTasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              manualColumn: targetColumn,
              manualOrder: targetIndex,
              updatedAt: new Date().toISOString(),
            };
          }

          // Update order of other tasks in the same column
          const taskCol = currentColumns.get(task.id) ?? 0;
          if (taskCol === targetColumn && task.manualOrder !== undefined) {
            if (task.manualOrder >= targetIndex) {
              return {
                ...task,
                manualOrder: task.manualOrder + 1,
              };
            }
          }

          return task;
        });
      });
    },
    [],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Roadmap</h1>

          {/* View mode toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("graph")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                viewMode === "graph"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Graph
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 pr-4 py-2 bg-muted border border-transparent rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Filter button */}
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-muted rounded-lg transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Roadmap content */}
      <div ref={containerRef} className="flex-1 overflow-auto p-6">
        {viewMode === "graph" ? (
          <GraphView
            columns={columns}
            maxColumn={maxColumn}
            dependencyLines={dependencyLines}
            selectedTaskId={selectedTaskId}
            onTaskSelect={handleTaskSelect}
            onTaskMove={handleTaskMove}
            tasks={filteredTasks}
            taskColumns={taskColumns}
          />
        ) : (
          <ListView
            tasks={filteredTasks}
            taskColumns={taskColumns}
            selectedTaskId={selectedTaskId}
            onTaskSelect={handleTaskSelect}
          />
        )}
      </div>

      {/* APPER indicator */}
      <APPERIndicator />
    </div>
  );
}

// Graph view with dependency lines and smart drag-and-drop
function GraphView({
  columns,
  maxColumn,
  dependencyLines,
  selectedTaskId,
  onTaskSelect,
  onTaskMove,
  tasks,
  taskColumns,
}: {
  columns: [number, Task[]][];
  maxColumn: number;
  dependencyLines: ReturnType<typeof calculateDependencyLines>;
  selectedTaskId?: string;
  onTaskSelect: (id: string) => void;
  onTaskMove: (
    taskId: string,
    targetColumn: number,
    targetIndex: number,
  ) => void;
  tasks: Task[];
  taskColumns: Map<string, number>;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const taskRefsMap = useRef<Map<string, HTMLElement>>(new Map());
  const columnRefsMap = useRef<Map<number, HTMLElement>>(new Map());
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [columnBounds, setColumnBounds] = useState<ColumnBounds[]>([]);
  const [lines, setLines] = useState<
    Array<{
      id: string;
      path: string;
      isCompleted: boolean;
      fromTaskId: string;
      toTaskId: string;
    }>
  >([]);

  // Get valid column range for dragged task
  const draggedTaskRange = useMemo(() => {
    if (!draggedTaskId) return null;
    const minCol = getMinColumnForTask(draggedTaskId, tasks);
    const maxCol = getMaxColumnForTask(draggedTaskId, tasks, taskColumns);
    return { min: minCol, max: Math.min(maxCol, maxColumn + 1) };
  }, [draggedTaskId, tasks, taskColumns, maxColumn]);

  // Calculate column and task bounds for drag detection
  const updateBounds = useCallback(() => {
    const bounds: ColumnBounds[] = [];

    columnRefsMap.current.forEach((el, columnIndex) => {
      const rect = el.getBoundingClientRect();
      const taskBounds: ColumnBounds["taskBounds"] = [];

      // Get tasks in this column
      const columnTasks =
        columns.find(([col]) => col === columnIndex)?.[1] || [];

      columnTasks.forEach((task) => {
        const taskEl = taskRefsMap.current.get(task.id);
        if (taskEl) {
          const taskRect = taskEl.getBoundingClientRect();
          taskBounds.push({
            taskId: task.id,
            top: taskRect.top,
            bottom: taskRect.bottom,
            midY: taskRect.top + taskRect.height / 2,
          });
        }
      });

      bounds.push({
        column: columnIndex,
        left: rect.left,
        right: rect.right,
        taskBounds,
      });
    });

    setColumnBounds(bounds);
  }, [columns]);

  // Update bounds when columns change (using layoutEffect for synchronous measurement)
  useLayoutEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(updateBounds, 0);
    return () => clearTimeout(timeoutId);
  }, [columns, updateBounds]);

  // Calculate drop target from mouse position
  const calculateDropTarget = useCallback(
    (clientX: number, clientY: number): DropTarget | null => {
      if (!draggedTaskRange || columnBounds.length === 0) return null;

      // Find which column we're over (with generous margins)
      let targetColumn: ColumnBounds | null = null;
      const COLUMN_MARGIN = 40; // Extra margin for easier column detection

      for (const col of columnBounds) {
        if (
          clientX >= col.left - COLUMN_MARGIN &&
          clientX <= col.right + COLUMN_MARGIN
        ) {
          targetColumn = col;
          break;
        }
      }

      // If not over any existing column, check if we should show a new column
      if (!targetColumn) {
        const lastColumn = columnBounds[columnBounds.length - 1];
        if (lastColumn && clientX > lastColumn.right) {
          // Potentially targeting a new column to the right
          const newColumnIndex = lastColumn.column + 1;
          if (
            newColumnIndex >= draggedTaskRange.min &&
            newColumnIndex <= draggedTaskRange.max
          ) {
            return { column: newColumnIndex, index: 0, isValid: true };
          }
        }
        return null;
      }

      // Check if this column is valid
      const isValid =
        targetColumn.column >= draggedTaskRange.min &&
        targetColumn.column <= draggedTaskRange.max;

      // Find the index within the column based on Y position
      let targetIndex = 0;
      const tasks = targetColumn.taskBounds;

      if (tasks.length === 0) {
        targetIndex = 0;
      } else {
        // Find where in the list to insert based on Y position
        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i];
          // Skip the dragged task itself
          if (task.taskId === draggedTaskId) continue;

          if (clientY < task.midY) {
            targetIndex = i;
            break;
          }
          targetIndex = i + 1;
        }
      }

      return { column: targetColumn.column, index: targetIndex, isValid };
    },
    [draggedTaskRange, columnBounds, draggedTaskId],
  );

  // Calculate SVG paths after layout
  useLayoutEffect(() => {
    const calculateLines = () => {
      if (!svgRef.current) return;

      const svgRect = svgRef.current.getBoundingClientRect();
      const newLines: typeof lines = [];

      for (const dep of dependencyLines) {
        const fromEl = taskRefsMap.current.get(dep.fromTaskId);
        const toEl = taskRefsMap.current.get(dep.toTaskId);

        if (!fromEl || !toEl) continue;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = fromRect.right - svgRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - svgRect.top;
        const x2 = toRect.left - svgRect.left;
        const y2 = toRect.top + toRect.height / 2 - svgRect.top;

        const midX = (x1 + x2) / 2;
        const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

        const fromTask = tasks.find((t) => t.id === dep.fromTaskId);
        const isCompleted = fromTask?.status === "completed";

        newLines.push({
          id: dep.id,
          path,
          isCompleted,
          fromTaskId: dep.fromTaskId,
          toTaskId: dep.toTaskId,
        });
      }

      setLines(newLines);
    };

    const timeoutId = setTimeout(calculateLines, 0);

    const resizeObserver = new ResizeObserver(() => {
      calculateLines();
      updateBounds();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [dependencyLines, columns, tasks, updateBounds]);

  const isLineHighlighted = (line: (typeof lines)[0]) => {
    if (!hoveredTaskId) return false;
    return line.fromTaskId === hoveredTaskId || line.toTaskId === hoveredTaskId;
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);

    // Set a custom drag image (optional - makes it look nicer)
    const el = taskRefsMap.current.get(taskId);
    if (el) {
      e.dataTransfer.setDragImage(el, el.offsetWidth / 2, 20);
    }

    // Update bounds right before drag starts
    setTimeout(updateBounds, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const target = calculateDropTarget(e.clientX, e.clientY);
    setDropTarget(target);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (draggedTaskId && dropTarget && dropTarget.isValid) {
      onTaskMove(draggedTaskId, dropTarget.column, dropTarget.index);
    }

    setDraggedTaskId(null);
    setDropTarget(null);
  };

  // Generate all columns including potential new column during drag
  const allColumns = useMemo(() => {
    const result: [number, Task[]][] = [];
    const columnMap = new Map(columns);

    const maxColToShow =
      draggedTaskId && draggedTaskRange
        ? Math.max(maxColumn, draggedTaskRange.max)
        : maxColumn;

    for (let i = 0; i <= maxColToShow; i++) {
      result.push([i, columnMap.get(i) || []]);
    }

    return result;
  }, [columns, maxColumn, draggedTaskId, draggedTaskRange]);

  // Check if a column should be highlighted as valid drop target
  const isColumnValidForDrop = (columnIndex: number) => {
    if (!draggedTaskRange) return false;
    return (
      columnIndex >= draggedTaskRange.min && columnIndex <= draggedTaskRange.max
    );
  };

  return (
    <div
      className="relative min-h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={() => setDropTarget(null)}
    >
      {/* SVG layer for dependency lines */}
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ zIndex: 0 }}
      >
        {lines.map((line) => {
          const highlighted = isLineHighlighted(line);
          return (
            <path
              key={line.id}
              d={line.path}
              fill="none"
              strokeWidth={highlighted ? 2.5 : 1.5}
              className={cn(
                "transition-all duration-200",
                highlighted
                  ? line.isCompleted
                    ? "stroke-status-completed"
                    : "stroke-primary"
                  : line.isCompleted
                    ? "stroke-status-completed/15"
                    : "stroke-muted-foreground/10",
              )}
            />
          );
        })}
      </svg>

      {/* Task columns */}
      <div
        ref={containerRef}
        className="relative flex gap-8"
        style={{ zIndex: 1 }}
      >
        {allColumns.map(([columnIndex, columnTasks]) => {
          const isValidColumn = isColumnValidForDrop(columnIndex);
          const isEmptyColumn = columnTasks.length === 0;
          const isTargetColumn = dropTarget?.column === columnIndex;
          const showEmptyColumn = draggedTaskId && isValidColumn;

          // Don't show empty columns unless dragging and valid
          if (isEmptyColumn && !showEmptyColumn) return null;

          return (
            <div
              key={columnIndex}
              ref={(el) => {
                if (el) {
                  columnRefsMap.current.set(columnIndex, el);
                } else {
                  columnRefsMap.current.delete(columnIndex);
                }
              }}
              className={cn(
                "flex flex-col gap-3 min-w-[280px] p-2 rounded-lg transition-all duration-200",
                isEmptyColumn && "min-h-[200px]",
                draggedTaskId && isValidColumn && "bg-primary/5",
                draggedTaskId && !isValidColumn && "opacity-50",
                isTargetColumn &&
                  dropTarget?.isValid &&
                  "ring-2 ring-primary/50",
              )}
            >
              {/* Column header indicator during drag */}
              {draggedTaskId && (
                <div
                  className={cn(
                    "text-xs font-medium text-center py-1 rounded transition-all",
                    isValidColumn ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {isValidColumn ? "✓" : "✗"}
                </div>
              )}

              {columnTasks.map((task, index) => {
                const isDropBefore =
                  isTargetColumn &&
                  dropTarget?.index === index &&
                  dropTarget?.isValid;
                const isDropAfter =
                  isTargetColumn &&
                  dropTarget?.index === index + 1 &&
                  dropTarget?.isValid &&
                  index === columnTasks.length - 1;

                return (
                  <div key={task.id} className="relative">
                    {/* Drop indicator before */}
                    <div
                      className={cn(
                        "absolute -top-2 left-0 right-0 h-1 rounded-full transition-all duration-150",
                        isDropBefore ? "bg-primary scale-100" : "scale-0",
                      )}
                    />

                    <div
                      ref={(el) => {
                        if (el) {
                          taskRefsMap.current.set(task.id, el);
                        } else {
                          taskRefsMap.current.delete(task.id);
                        }
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onMouseEnter={() => setHoveredTaskId(task.id)}
                      onMouseLeave={() => setHoveredTaskId(null)}
                      className={cn(
                        "transition-all duration-200 cursor-grab active:cursor-grabbing",
                        draggedTaskId === task.id && "opacity-30 scale-95",
                      )}
                    >
                      <TaskCard
                        task={task}
                        isSelected={selectedTaskId === task.id}
                        onClick={() => onTaskSelect(task.id)}
                      />
                    </div>

                    {/* Drop indicator after (only for last item) */}
                    <div
                      className={cn(
                        "absolute -bottom-2 left-0 right-0 h-1 rounded-full transition-all duration-150",
                        isDropAfter ? "bg-primary scale-100" : "scale-0",
                      )}
                    />
                  </div>
                );
              })}

              {/* Empty column drop zone */}
              {isEmptyColumn && (
                <div
                  className={cn(
                    "flex-1 flex items-center justify-center rounded-lg border-2 border-dashed transition-all min-h-[150px]",
                    isValidColumn && isTargetColumn
                      ? "border-primary bg-primary/10"
                      : isValidColumn
                        ? "border-primary/30 bg-primary/5"
                        : "border-muted-foreground/20",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm",
                      isValidColumn ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {isValidColumn
                      ? isTargetColumn
                        ? "Release to drop"
                        : "Drop here"
                      : "Invalid"}
                  </span>
                </div>
              )}

              {/* Drop indicator at the end of non-empty columns */}
              {!isEmptyColumn && (
                <div
                  className={cn(
                    "h-1 rounded-full transition-all duration-150 mx-2",
                    isTargetColumn &&
                      dropTarget?.index === columnTasks.length &&
                      dropTarget?.isValid
                      ? "bg-primary"
                      : "bg-transparent",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Simple list view
function ListView({
  tasks,
  taskColumns,
  selectedTaskId,
  onTaskSelect,
}: {
  tasks: Task[];
  taskColumns: Map<string, number>;
  selectedTaskId?: string;
  onTaskSelect: (id: string) => void;
}) {
  // Sort by column then by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const colA = taskColumns.get(a.id) ?? 0;
    const colB = taskColumns.get(b.id) ?? 0;
    if (colA !== colB) return colA - colB;
    return a.priority - b.priority;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-muted-foreground border-b border-border">
            <th className="pb-3 font-medium w-12">Depth</th>
            <th className="pb-3 font-medium">Task</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Dependencies</th>
            <th className="pb-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task) => {
            const column = taskColumns.get(task.id) ?? 0;
            return (
              <tr
                key={task.id}
                onClick={() => onTaskSelect(task.id)}
                className={cn(
                  "border-b border-border cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedTaskId === task.id && "bg-muted",
                )}
              >
                <td className="py-3 text-muted-foreground text-sm">{column}</td>
                <td className="py-3 font-medium">{task.title}</td>
                <td className="py-3">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      task.status === "completed" &&
                        "bg-status-completed/20 text-status-completed",
                      task.status === "running" &&
                        "bg-status-running/20 text-status-running",
                      task.status === "review" &&
                        "bg-status-review/20 text-status-review",
                      task.status === "ready" &&
                        "bg-status-ready/20 text-status-ready",
                      task.status === "pending" &&
                        "bg-status-pending/20 text-status-pending",
                    )}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="py-3 text-sm text-muted-foreground">
                  {task.dependencies.length || "-"}
                </td>
                <td className="py-3 text-sm text-muted-foreground">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// APPER cycle indicator
function APPERIndicator() {
  const phases = [
    { key: "A", label: "Analyze", active: false },
    { key: "P", label: "Prioritize", active: false },
    { key: "P", label: "Plan", active: false },
    { key: "E", label: "Execute", active: true },
    { key: "R", label: "Review", active: false },
  ];

  return (
    <div className="flex items-center justify-center gap-1 py-3 border-t border-border bg-card/50">
      <span className="text-xs text-muted-foreground mr-2">APPER Cycle:</span>
      {phases.map((phase, i) => (
        <div key={i} className="flex items-center">
          <span
            className={cn(
              "text-xs font-mono px-2 py-1 rounded",
              phase.active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground",
            )}
            title={phase.label}
          >
            {phase.key}
          </span>
          {i < phases.length - 1 && (
            <span className="text-muted-foreground/30 mx-0.5">→</span>
          )}
        </div>
      ))}
    </div>
  );
}
