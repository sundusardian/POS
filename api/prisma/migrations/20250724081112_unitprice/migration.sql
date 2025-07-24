-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ingredients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "unitPrice" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ingredients" ("category", "createdAt", "description", "id", "isActive", "name", "unit", "updatedAt") SELECT "category", "createdAt", "description", "id", "isActive", "name", "unit", "updatedAt" FROM "ingredients";
DROP TABLE "ingredients";
ALTER TABLE "new_ingredients" RENAME TO "ingredients";
CREATE UNIQUE INDEX "ingredients_name_key" ON "ingredients"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
