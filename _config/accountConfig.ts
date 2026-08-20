import { DynamicFieldConfig } from "@/_elements/cardForm";
import { DialogField } from "./types";
import { Role } from "@/generated/prisma/enums";

export type LoginData = {
    token: string;
    expiresAt: Date;
}

export type AccountType = {
    email: string;
    password: string;
}



export type AccountData = {
    id: number;
    email: string;
    role: Role;
}

export const authenticationFields: Array<DynamicFieldConfig> = [
    {
        name: "email",
        label: "Enter your email",
        type: "text",
        placeholder: "",
    },
    {
        name: "password",
        label: "Enter your password",
        type: "password",
        placeholder: "",
    }
]