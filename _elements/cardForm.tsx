"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export type DynamicFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "date"
  | "select"
  | "radio";

export interface DynamicFieldOption {
  label: string;
  value: string;
}

export interface DynamicFieldConfig {
  name: string;
  label?: string;
  placeholder?: string;
  type?: DynamicFieldType;
  required?: boolean;
  defaultValue?: string;
  /** Required when type is "select" or "radio" */
  options?: DynamicFieldOption[];
}

export interface DynamicCardFormProps {
  title: string;
  description?: string;
 
  fields?: DynamicFieldConfig[];
  numberOfInputs?: number;
  submitLabel?: string;
  onSubmit?: (values: Record<string, string>) => void;
  className?: string;
}


export default function DynamicCardForm({
  title,
  description,
  fields,
  numberOfInputs = 0,
  submitLabel = "Submit",
  onSubmit,
  className,
}: DynamicCardFormProps) {
  const resolvedFields: DynamicFieldConfig[] = React.useMemo(() => {
    if (fields && fields.length > 0) return fields;
    return Array.from({ length: numberOfInputs }, (_, i) => ({
      name: `field-${i + 1}`,
      label: `Field ${i + 1}`,
      placeholder: `Enter field ${i + 1}`,
      type: "text" as const,
    }));
  }, [fields, numberOfInputs]);

  const [values, setValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(
      resolvedFields.map((f) => [f.name, f.defaultValue ?? ""]),
    ),
  );

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(values);
  };

  const renderField = (field: DynamicFieldConfig) => {
    switch (field.type) {
      case "select":
        return (
          <Select
            value={values[field.name] ?? ""}
            onValueChange={(value) => handleChange(field.name, value ?? "")}
          >
            <SelectTrigger id={field.name}>
              <SelectValue
                placeholder={field.placeholder ?? "Select an option"}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={values[field.name] ?? ""}
            onValueChange={(value) => handleChange(field.name, value)}
          >
            {field.options?.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  id={`${field.name}-${opt.value}`}
                  value={opt.value}
                />
                <Label
                  htmlFor={`${field.name}-${opt.value}`}
                  className="font-normal"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return (
          <Input
            id={field.name}
            name={field.name}
            type={field.type ?? "text"}
            placeholder={field.placeholder}
            required={field.required}
            value={values[field.name] ?? ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <Card className={className}>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>

        <CardContent className="space-y-4 mt-4 gap-4">
          {resolvedFields.map((field) => (
            <div key={field.name} className="space-y-2">
              {field.label && <Label htmlFor={field.name}>{field.label}</Label>}
              {renderField(field)}
            </div>
          ))}
        </CardContent>

        <CardFooter className="mt-4">
          <Button type="submit" className="w-full">
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
