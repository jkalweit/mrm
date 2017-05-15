import { SyncNode } from 'syncnode-common';

export interface Main extends SyncNode {
    checklists: SyncNode;
}

export interface List extends SyncNode {
    name: string;
    groups: SyncNode;
}

export interface Group extends SyncNode {
    name: string;
    items: SyncNode;
}

export interface Item extends SyncNode {
    name: string;
    completedAt: string;
}