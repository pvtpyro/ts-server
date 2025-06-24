

import bcrypt from 'bcrypt';
const saltRounds = 10;

export async function hashPassword(password: string) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

export async function checkPasswordHash(password: string, hash: string) {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password hash:', error);
        throw error;
    }
}