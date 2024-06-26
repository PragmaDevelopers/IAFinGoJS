import { Cell, flexRender } from "@tanstack/react-table";

const formatCell = (value: Cell<unknown, unknown>) => {
    if (value.renderValue() instanceof Date) {
        const dateValue: Date = value.renderValue() as Date;
        return dateValue.toLocaleDateString();
    }
    return flexRender(
        value.column.columnDef.cell,
        value.getContext()
    )
};

export default formatCell;