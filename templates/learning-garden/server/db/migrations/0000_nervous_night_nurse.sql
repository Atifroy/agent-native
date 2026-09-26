CREATE TABLE "garden_activity_state" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_email" text NOT NULL,
	"activity" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"correct" integer DEFAULT 0 NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"best_streak" integer DEFAULT 0 NOT NULL,
	"difficulty_json" text DEFAULT '{}' NOT NULL,
	"last_played_at" text,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_garden_activity_state_unique_owner_activity" ON "garden_activity_state" USING btree ("owner_email","activity");