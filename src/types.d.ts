import { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction, Collection } from 'discord.js';

export interface SlashCommand {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    command: SlashCommandBuilder|any,
    execute: (interaction: ChatInputCommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number
}

export interface Event {
    name: string,
    once?: boolean,
    execute: (...args) => Promise
}

export interface RestCommandData {
    id: string,
    name: string,
    description: string,
    length: number
}

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, SlashCommand>
    }
}

export type Rank = 'person' | 'member' | 'observer' | 'admin'

export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    mailcom?: string | null;
    username: string | null;
    rank: Rank
}

export interface Fetch {
    type: FetchType;
}

export type FetchType =
true |
'session' |
'authority' |
'params' |
'undefined'

export interface FetchError extends Fetch {
    error: string; 
}

export interface FetchUser extends User, Fetch {
}