export interface Thingspeak {
    channel: Channel;
    feeds: Feed[];
}

export interface Channel {
    id: number;
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    field1: string;
    field2: string;
    field3: string;
    field4: string | null;
    field5: string | null;
    field6: string | null;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  }

export interface Feed {
    created_at: string;
    entry_id: number;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
  }