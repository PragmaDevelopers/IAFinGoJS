const formatData = (value: any) => {
    if (value instanceof Date) {
        const dateValue: Date = value as Date;
        return dateValue.toLocaleDateString();
    }
    return value;
};

export default formatData;