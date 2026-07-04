import { Router } from "express";
import { query } from "../db";

const router = Router();

type Project = {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
};

router.get("/", async (_req, res) => {
    try {
        const result = await query<Project>(
            "SELECT * FROM projects ORDER BY created_at DESC"
        );
        res.json(result.rows);
    }catch{
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

router.post("/", async (req, res)=> {
    try {
        const { name, description} = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Project name is required and must be a string" });
        }

        const result = await query<Project>(
            `INSERT INTO projects(name, description)
            VALUES($1, $2) 
            RETURNING *
            `,
            [name, description || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to create project" });
    }
});

export default router;