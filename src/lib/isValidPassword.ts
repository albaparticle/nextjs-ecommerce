export async function isValidPassword(password: string, hashedPassword: string):Promise<boolean> {
    return await hashPassword(password) === hashedPassword;
}

async function hashPassword(password: string):Promise<string> {
    const arrayBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password));
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64 = btoa(String.fromCharCode(...uint8Array));
    return base64;
}