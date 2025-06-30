import { format, parseISO } from 'date-fns';

export const formatISODate = (isoString: string, formatString = 'HH:mm:ss dd/MM/yyyy'): string => {
    if (!isoString) return '';

    try {
        const date = parseISO(isoString);
        return format(date, formatString);
    } catch (error) {
        console.error("Lỗi format ngày tháng:", isoString, error);
        return '';
    }
};