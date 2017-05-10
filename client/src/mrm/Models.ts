import { SyncNode } from 'syncnode-common';

export interface Main extends SyncNode {
    mrms: SyncNode;
}

export interface MRM extends SyncNode {
    name: string;
}
