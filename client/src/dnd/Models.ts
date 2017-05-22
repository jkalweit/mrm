import { SyncNode } from 'syncnode-common';

export interface Main extends SyncNode {
    toons: SyncNode;
	encounters: SyncNode;
}

export interface Toon extends SyncNode {
    name: string;
    note: string;
}


export interface Encounter extends SyncNode {
	name: string;
	note: string;
}
