export type MailDataType<T = never> = Readonly<{
    to: string;
    data: T;
}>