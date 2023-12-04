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