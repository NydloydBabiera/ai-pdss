"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MoreHorizontal, SearchIcon } from "lucide-react";
import { useState } from "react";
import { DataTableColumn } from "./dataTable";
import { Field, FieldLabel } from "@/components/ui/field";

interface FilterProps {
  filterBy: DataTableColumn<any>[];
}

export function Filter({ filterBy }: FilterProps) {
  const [filterText, setFilterText] = useState(
    filterBy[0]?.header.toString() || "",
  );

  return (
    <div className="grid max-w-sm w-full">
      <Field>
        <FieldLabel htmlFor="inline-start-input">Filter</FieldLabel>
        <InputGroup>
          <InputGroupInput placeholder={`Search student by ${filterText}`} />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <InputGroupButton
                    variant="ghost"
                    aria-label="More"
                    size="icon-xs"
                  >
                    <MoreHorizontal />
                  </InputGroupButton>
                }
              />
              <DropdownMenuContent align="end" sideOffset={8} alignOffset={-4}>
                <DropdownMenuGroup>
                  <DropdownMenuRadioGroup
                    value={filterText}
                    onValueChange={setFilterText}
                  >
                    {filterBy.map((column) => (
                      <DropdownMenuRadioItem
                        key={column.key.toString()}
                        value={column.header.toString()}
                      >
                        {column.header}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
