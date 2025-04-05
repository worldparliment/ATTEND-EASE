import * as bcrypt from "bcryptjs";

export async function encrypt_password(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export async function match_password(hashed_password: string, password: string): Promise<boolean> {
    if (!hashed_password || !password) return false;
    return await bcrypt.compare(password, hashed_password);
}