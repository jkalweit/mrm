import { SyncNode } from 'syncnode-common';

export interface Main extends SyncNode {
    threads: Threads;
}

export interface Threads extends SyncNode {
    active: SyncNode;
    archived: SyncNode;
}

export interface Thread extends SyncNode {
    createdAt: string;
    createdBy: string;
    name: string;
    messages: SyncNode;
}

export interface ThreadMessage extends SyncNode {
    createdAt: string;
    createdBy: string;
    text: string;
}