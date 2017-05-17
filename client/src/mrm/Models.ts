import { SyncNode } from 'syncnode-common';

export interface Main extends SyncNode {
    mrms: SyncNode;
}

export interface MRM extends SyncNode {
    name: string;
    section4_1: Section4_1;
}


export interface Section4_1 extends SyncNode {
    positive: SyncNode;
    negative: SyncNode;
}