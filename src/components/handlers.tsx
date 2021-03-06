export const CheckResponse = (response: { err_msg: string; ret_code: number }): boolean => {
    if (response.ret_code !== 0) {
        console.error(response.err_msg);
        return false;
    }

    return true;
};

export const withErrorHandling = (fn: () => void): void => {
    try {
        fn();
    } catch (err) {
        console.error(err);
    }
};

export const withErrorHandlingAsync = async (fn: () => Promise<void>): Promise<void> => {
    try {
        await fn();
    } catch (err) {
        console.error(err);
    }
};
