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

export const formatCurrency = (amount: number): string => {
    if (typeof amount !== 'number') {
        return '0 ₫';
    }

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    return formatter.format(amount);
};