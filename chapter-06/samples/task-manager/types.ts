// 第6章: タスク管理システム - 型定義
// すべてのコンポーネントで使用する共通の型定義

export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
}

export interface TaskCreateInput {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags?: string[];
}

export interface TaskUpdateInput {
    id: string;
    title?: string;
    description?: string;
    status?: 'todo' | 'in-progress' | 'done';
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags?: string[];
}

export interface TaskFilter {
    status?: 'todo' | 'in-progress' | 'done';
    priority?: 'low' | 'medium' | 'high';
    tag?: string;
    searchText?: string;
}
