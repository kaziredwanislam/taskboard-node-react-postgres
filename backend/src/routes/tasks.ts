import { Router } from "express";
import { query } from "../db";

const router = Router();

type Task={
    id: number;
    project_id: number;
    title: string;
    status: "todo" | "doing" | "done";
    created_at: string;
};

const allowedStatuses = ["todo", "doing", "done"];

router.get("/",async (_req,res)=>{
    try{
        const result = await query<Task>(
            `SELECT * FROM tasks ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

router.post("/", async(req, res)=>{
    try{
        const { projectId, title } = req.body;

        if(!projectId || !title){
            return res.status(400).json({ error: "Project ID and title are required" });
        }

        const result = await query<Task>(
            `INSERT INTO tasks(project_id, title)
            VALUES($1, $2)
            RETURNING *
            `,
            [projectId, title]
        );
        res.status(201).json(result.rows[0]);
    }catch {
        res.status(500).json({ error: "Failed to create task" });
    }
});

router.patch("/:id/status", async(req, res)=>{
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if(!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const result = await query<Task> (
            `UPDATE tasks 
             SET status = $1
             WHERE id = $2
             RETURNING * 
            `,
            [status, id]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(result.rows[0]);
    }catch {
        res.status(500).json({ error: "Failed to update task status" });
    }
});

router.delete("/:id", async(req, res) =>{
    try {
        const { id } = req.params;
        const result = await query<Task>(
            `DELETE FROM tasks
             WHERE id = $1
             RETURNING *
            `,
            [id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({ error: "Task not found"});
        }
        res.json({ message: "Task deleted successfully"});
    }catch {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

export default router;