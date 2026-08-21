import { DynamicFieldConfig } from "@/_elements/cardForm";
import { DialogField } from "./types";
import { Role } from "@/generated/prisma/enums";
import { InstructorData } from "./instructorConfig";

export type LoginData = {
    token: string;
    expiresAt: Date;
    isFirstLogin: boolean;
    accountId?: number;
}

export type AccountType = {
    email: string;
    password: string;
}



export type AccountData = {
    id: number;
    email: string;
    role: Role;
    instructor?: InstructorData
}

export type UpdatePasswordType = {
    id: number;
    newPassword: string;
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

export const updatePasswordFields: Array<DynamicFieldConfig> = [
    {
        name: "password",
        label: "Enter your new password",
        type: "password",
        placeholder: "",
    },
    {
        name: "confirmPassword",
        label: "Confirm your password",
        type: "password",
        placeholder: "",
    }
]