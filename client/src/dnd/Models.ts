import { SyncNode } from 'syncnode-common';

export interface Main extends SyncNode {
    toons: SyncNode;
}

export interface Toon extends SyncNode {
    name: string;
    note: string;
}