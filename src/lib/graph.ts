import type { Task } from "@/types";

/**
 * Calculate the minimum column for a task based on dependencies.
 * A task MUST be placed in a column >= this value.
 */
export function calculateMinColumn(
  taskId: string,
  taskMap: Map<string, Task>,
  cache: Map<string, number> = new Map(),
  visited: Set<string> = new Set(),
): number {
  if (cache.has(taskId)) return cache.get(taskId)!;

  // Prevent circular dependencies
  if (visited.has(taskId)) {
    console.warn(`Circular dependency detected for task ${taskId}`);
    return 0;
  }

  const task = taskMap.get(taskId);
  if (!task) return 0;

  visited.add(taskId);

  // No dependencies = can be in column 0
  if (task.dependencies.length === 0) {
    cache.set(taskId, 0);
    return 0;
  }

  // Min column = max(min column of dependencies) + 1
  const maxDepColumn = Math.max(
    ...task.dependencies.map((depId) =>
      calculateMinColumn(depId, taskMap, cache, new Set(visited)),
    ),
  );

  // Also consider if dependency has a manual column
  const maxDepManualColumn = Math.max(
    ...task.dependencies.map((depId) => {
      const dep = taskMap.get(depId);
      return (
        dep?.manualColumn ??
        calculateMinColumn(depId, taskMap, cache, new Set(visited))
      );
    }),
  );

  const minColumn = Math.max(maxDepColumn, maxDepManualColumn) + 1;
  cache.set(taskId, minColumn);
  return minColumn;
}

/**
 * Calculate the effective column for a task.
 * Uses manualColumn if set and valid, otherwise uses the minimum required column.
 */
export function calculateTaskColumns(tasks: Task[]): Map<string, number> {
  const columns = new Map<string, number>();
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const minColumnCache = new Map<string, number>();

  for (const task of tasks) {
    const minCol = calculateMinColumn(task.id, taskMap, minColumnCache);

    // Use manual column if set and valid (>= minimum)
    if (task.manualColumn !== undefined && task.manualColumn >= minCol) {
      columns.set(task.id, task.manualColumn);
    } else {
      columns.set(task.id, minCol);
    }
  }

  return columns;
}

/**
 * Get the minimum column where a task can be placed.
 */
export function getMinColumnForTask(taskId: string, tasks: Task[]): number {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  return calculateMinColumn(taskId, taskMap);
}

/**
 * Get the maximum column where a task can be placed.
 * Limited by tasks that depend on this task.
 */
export function getMaxColumnForTask(
  taskId: string,
  tasks: Task[],
  taskColumns: Map<string, number>,
): number {
  // Find tasks that depend on this task
  const dependentTasks = tasks.filter((t) => t.dependencies.includes(taskId));

  if (dependentTasks.length === 0) {
    // No dependents, can go anywhere to the right
    return Infinity;
  }

  // Max column = min(column of dependents) - 1
  return Math.min(...dependentTasks.map((t) => taskColumns.get(t.id) ?? 0)) - 1;
}

/**
 * Check if a task can be moved to a specific column.
 */
export function canMoveToColumn(
  taskId: string,
  targetColumn: number,
  tasks: Task[],
  taskColumns: Map<string, number>,
): boolean {
  const minCol = getMinColumnForTask(taskId, tasks);
  const maxCol = getMaxColumnForTask(taskId, tasks, taskColumns);
  return targetColumn >= minCol && targetColumn <= maxCol;
}

/**
 * Group tasks by their calculated column
 */
export function groupTasksByColumn(
  tasks: Task[],
  columns: Map<string, number>,
): Map<number, Task[]> {
  const groups = new Map<number, Task[]>();

  for (const task of tasks) {
    const column = columns.get(task.id) ?? 0;
    const existing = groups.get(column) || [];
    existing.push(task);
    groups.set(column, existing);
  }

  // Sort tasks within each column
  // If manualOrder is set, use it; otherwise fall back to status/priority
  const statusOrder: Record<string, number> = {
    running: 0,
    review: 1,
    ready: 2,
    pending: 3,
    completed: 4,
    failed: 5,
    cancelled: 6,
  };

  for (const [column, columnTasks] of groups) {
    columnTasks.sort((a, b) => {
      // If both have manual order, use it
      if (a.manualOrder !== undefined && b.manualOrder !== undefined) {
        return a.manualOrder - b.manualOrder;
      }
      // Manual order takes precedence
      if (a.manualOrder !== undefined) return -1;
      if (b.manualOrder !== undefined) return 1;
      // Otherwise, sort by status then priority
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      return a.priority - b.priority;
    });
    groups.set(column, columnTasks);
  }

  return groups;
}

/**
 * Calculate connection lines between dependent tasks
 */
export interface DependencyLine {
  id: string;
  fromTaskId: string;
  toTaskId: string;
  fromColumn: number;
  toColumn: number;
}

export function calculateDependencyLines(
  tasks: Task[],
  columns: Map<string, number>,
): DependencyLine[] {
  const lines: DependencyLine[] = [];

  for (const task of tasks) {
    const toColumn = columns.get(task.id) ?? 0;

    for (const depId of task.dependencies) {
      const fromColumn = columns.get(depId) ?? 0;

      lines.push({
        id: `${depId}->${task.id}`,
        fromTaskId: depId,
        toTaskId: task.id,
        fromColumn,
        toColumn,
      });
    }
  }

  return lines;
}
