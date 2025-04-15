import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const medicalReports = pgTable("medical_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  originalText: text("original_text").notNull(),
  simplifiedText: text("simplified_text").notNull(),
  identifiedTerms: jsonb("identified_terms").$type<MedicalTerm[]>().notNull(),
  createdAt: text("created_at").notNull(),
  isAnonymized: boolean("is_anonymized").notNull().default(false),
});

export const insertMedicalReportSchema = createInsertSchema(medicalReports).pick({
  userId: true,
  originalText: true,
  simplifiedText: true,
  identifiedTerms: true,
  createdAt: true,
  isAnonymized: true,
});

export type MedicalTerm = {
  term: string;
  simplified: string;
  definition: string;
  normalRange?: string;
  value?: string;
  status?: 'normal' | 'low' | 'high' | 'borderline-high' | 'borderline-low' | 'abnormal';
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMedicalReport = z.infer<typeof insertMedicalReportSchema>;
export type MedicalReport = typeof medicalReports.$inferSelect;
