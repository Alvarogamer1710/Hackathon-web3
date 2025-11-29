import fs from "fs";
import path from "path";

const DB_FILE = path.join(__dirname, "..", "users.json");

export type User = {
    id: number;
    email: string;
    password: string;
    hasPaid?: boolean;
};

export const getUsers = (): User[] => {
    try {
        const data = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(data) as User[];
    } catch (error) {
        return [];
    }
};

export const saveUsers = (users: User[]) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf-8");
};
