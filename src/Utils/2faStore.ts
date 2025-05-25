const codeStore = new Map<string, { code: string, expiresAt: number }>();

export const saveCode = (email: string, code: string) => {
    const expiresAt = Date.now() + 5 * 60 * 1000; // expira em 5 minutos
    codeStore.set(email, { code, expiresAt });
};

export const verifyCode = (email: string, inputCode: string): boolean => {
    
    const record = codeStore.get(email);
    if (!record) 
        return false;
    
    const isValid = record.code === inputCode && Date.now() < record.expiresAt;
    if (isValid) codeStore.delete(email); // invalida após o uso
        return isValid;
};

const approvedForReset = new Set<string>();

export const authorizeReset = (email: string) => {
    approvedForReset.add(email);
    setTimeout(() => approvedForReset.delete(email), 5 * 60 * 1000); // remove após 5 minutos
};

export const isAuthorizedForReset = (email: string) => {
    return approvedForReset.has(email);
};
