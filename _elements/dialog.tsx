"use client";

import { ReactElement, ReactNode, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DialogField } from "@/_config/types";

type FormDialogProps = {
  trigger?: ReactElement;

  title: string;
  description?: string;

  fields?: DialogField[];

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  onSubmit?: (values: Record<string, string | boolean>) => void;

  submitText?: string;
  cancelText?: string;

  footer?: ReactNode;

  children?: ReactNode;
};

export function FormDialog({
  trigger,
  title,
  description,
  fields = [],
  open,
  onOpenChange,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  footer,
  children,
}: FormDialogProps) {
  const [values, setValues] = useState<Record<string, string | boolean>>(
    fields.reduce(
      (acc, field) => {
        acc[field.name] = field.defaultValue ?? "";
        return acc;
      },
      {} as Record<string, string | boolean>,
    ),
  );

  const handleChange = (name: string, value: string | boolean) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {fields.map((field) => {
              const fieldType = field.type ?? "text";

              /*
               * CHECKBOX
               */
              if (fieldType === "checkbox") {
                return (
                  <div key={field.name} className="flex items-center gap-3">
                    <Checkbox
                      id={field.name}
                      checked={values[field.name] === true}
                      onCheckedChange={(checked) =>
                        handleChange(field.name, checked === true)
                      }
                    />

                    <Label htmlFor={field.name} className="cursor-pointer">
                      {field.label}

                      {field.required && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </Label>
                  </div>
                );
              }

              /*
               * RADIO
               */
              if (fieldType === "radio") {
                return (
                  <div key={field.name} className="space-y-3">
                    <Label>
                      {field.label}

                      {field.required && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </Label>

                    <RadioGroup
                      value={
                        typeof values[field.name] === "string"
                          ? (values[field.name] as string)
                          : ""
                      }
                      onValueChange={(value) => handleChange(field.name, value)}
                    >
                      {field.options?.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center gap-3"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`${field.name}-${option.value}`}
                          />

                          <Label
                            htmlFor={`${field.name}-${option.value}`}
                            className="cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                );
              }

              /*
               * DROPDOWN
               */
              if (fieldType === "dropdown") {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label}

                      {field.required && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </Label>

                    <Select
                      value={
                        typeof values[field.name] === "string"
                          ? (values[field.name] as string)
                          : ""
                      }
                      onValueChange={(value) => {
                        if (value !== null) {
                          handleChange(field.name, value);
                        }
                      }}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue
                          placeholder={field.placeholder ?? "Select an option"}
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              /*
               * DEFAULT INPUT
               */
              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}

                    {field.required && (
                      <span className="ml-1 text-destructive">*</span>
                    )}
                  </Label>

                  <Input
                    id={field.name}
                    name={field.name}
                    type={fieldType}
                    placeholder={field.placeholder}
                    value={
                      typeof values[field.name] === "string"
                        ? (values[field.name] as string)
                        : ""
                    }
                    required={field.required}
                    onChange={(event) =>
                      handleChange(field.name, event.target.value)
                    }
                  />
                </div>
              );
            })}

            {children}
          </div>

          <DialogFooter>
            {footer ?? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange?.(false)}
                >
                  {cancelText}
                </Button>

                <Button type="submit">{submitText}</Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
