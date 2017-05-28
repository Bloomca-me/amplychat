export interface Message {
    id: string;
    message: string;
}
export interface Store {
    connected: boolean;
    messages: Message[];
    left: boolean;
}
export declare const store: {
    connected: boolean;
    messages: Message[];
    left: boolean;
};
export declare function sendMessage(message: string): void;
export declare function chooseLanguage(code: string): void;
