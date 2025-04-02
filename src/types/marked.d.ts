declare module 'marked' {
    export function marked(text: string): string;
    export namespace marked {
        function setOptions(options: {
            gfm?: boolean;
            breaks?: boolean;
            pedantic?: boolean;
        }): void;
    }
} 