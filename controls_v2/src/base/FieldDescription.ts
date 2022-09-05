import { ReactNode } from "react";
import { ItnSelectOption } from "../props/IControlProps";
import { LooseObject } from "./LooseObject";

export class FieldDescription implements LooseObject {
    property: string;
    order: number;
    type: "string" | "number" | "select" | "autocomplete" | "date" | "checkbox" | "chip" | "password" = "string";
    disabled: boolean = false;
    placeholder: string | null = null;
    error: boolean = false;
    errorText: string | null = null;
    label: string | null = null;
    onClick: (() => void) | null = null;
    variant: "outlined" | "standard" | "filled" = "outlined";
    tooltip: string | null = null;
    custom: ((value: any, onChange: ((value: any) => void)) => ReactNode) | null = null;
    items: ItnSelectOption[] = [];
    min: number | null = null;
    max: number | null = null;
    minDate: Date | null = null;
    maxDate: Date | null = null;
    passwordLength: number = 8;
    allowNullInSelect: boolean = false;
    selectNullLabel: string | null = null;
    noOptionsText: string | null = null;
    display: boolean | (() => boolean) = true;

    constructor(order: number, property: string) {
        this.property = property;
        this.order = order;
    }
}
