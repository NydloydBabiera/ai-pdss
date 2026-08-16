export type Fields = {
    name: string;
    label: string;
    type: string;
    placeholder: string;
}

export type DialogFieldType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "dropdown"
    | "radio"
    | "checkbox";

export type DialogField = {
    name: string;
    label: string;
    type?: DialogFieldType;

    placeholder?: string;
    required?: boolean;

    defaultValue?: string | boolean;

    options?: DialogFieldOption[];
};

export type DialogFieldOption = {
    label: string;
    value: string;
};

