"use server";

import { Task, TaskFormState } from "@/app/lib/types";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

// --- FORM VALIDATIONS ---

const FormSchema = z.object({
  id: z.string(),
  name: z
    .string({ required_error: "Please give your task a name" })
    .min(3, "Please give your task a name longer than 3 character")
    .max(64, "Please give your task a name shorter than 64 character"),
  description: z.string().max(250).optional(),
  icon: z.coerce.number().default(1),
  status: z
    .enum(["completed", "inProgress", "willNotDo"])
    .optional()
    .nullable(),
});

const CreateTask = FormSchema.omit({ id: true });
const EditTask = FormSchema.omit({ id: true });

// --- CRUD ACTIONS ---

export const createTask = async (
  prevState: TaskFormState,
  taskFormData: FormData,
  taskboardId: number
): Promise<TaskFormState> => {
  const validatedFields = CreateTask.safeParse({
    name: taskFormData.get("name"),
    description: taskFormData.get("description"),
    icon: taskFormData.get("icon"),
    status: taskFormData.get("status"),
  });

  if (!validatedFields.success) {
    console.log({
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create a new task.",
    });
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create a new task.",
    };
  }

  const { icon, name, description, status } = validatedFields.data;

  try {
    await sql`INSERT INTO tasks (task_board_id, name, description, icon, status) VALUES (${taskboardId}, ${name}, ${description}, ${icon}, ${status});`;
  } catch (error) {
    return { message: "Database Error." };
  }

  revalidatePath("/[taskboardId]", "page");

  return {};
};

export const editTask = async (
  prevState: TaskFormState,
  taskFormData: FormData,
  taskId: number
): Promise<TaskFormState> => {
  const validatedFields = EditTask.safeParse({
    name: taskFormData.get("name"),
    description: taskFormData.get("description"),
    icon: taskFormData.get("icon"),
    status: taskFormData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to edit your task.",
    };
  }

  const { icon, name, description, status } = validatedFields.data;

  try {
    await sql`UPDATE tasks SET name = ${name}, description = ${description}, icon = ${icon}, status = ${status} WHERE id = ${taskId};`;
  } catch (error) {
    return { message: "Database Error." };
  }

  revalidatePath("/[taskboardId]", "page");
  return {};
};

export const fetchTasksByTaskboardId = async (
  taskboardId: number
): Promise<Task[] | undefined> => {
  noStore();

  try {
    const selectResult =
      await sql`SELECT * FROM tasks WHERE task_board_id=${taskboardId};`;

    return selectResult.rows as Task[];
  } catch (error) {
    console.error("Error getting new taskboard:", error);
  }
};

export const deleteTask = async (taskId: number): Promise<boolean> => {
  try {
    await sql`DELETE FROM tasks WHERE id=${taskId};`;

    revalidatePath("/[taskboardId]", "page");
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};

export const fetchTask = async (taskId: number): Promise<Task | undefined> => {
  noStore();

  try {
    const selectResult = await sql`SELECT * FROM tasks WHERE id=${taskId};`;

    return selectResult.rows[0] as Task;
  } catch (error) {
    console.error("Error getting new task:", error);
  }
};
