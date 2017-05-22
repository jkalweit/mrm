import { SyncNode } from 'syncnode-common';

export interface Main extends SyncNode {
    toons: SyncNode;
	encounters: SyncNode;
}

export interface Toon extends SyncNode {
    name: string;
    note: string;
    stats: ToonStats;
}

export interface ToonStats extends SyncNode {
    init: number;
    strength: number;
}

export interface Encounter extends SyncNode {
	name: string;
	note: string;
}
