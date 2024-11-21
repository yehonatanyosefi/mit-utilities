const { exec } = require("child_process");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

function cleanupTypeNames(content) {
  return content
    // Handle PascalCase types (e.g., PublicAppStatusSchema -> AppStatus)
    .replace(/public([A-Z][a-zA-Z]*)(Row|Insert|Update|Relationships)?Schema/g, '$1')
    // Handle camelCase variables and types (e.g., publicAppStatusSchema -> appStatusSchema)
    .replace(/public([a-z][a-zA-Z]*)(Row|Insert|Update|Relationships)?Schema/g, '$1')
    // Clean up any remaining instances of 'public' prefix
    .replace(/\bpublic([A-Z][a-zA-Z]*)/g, '$1')
    // Clean up any remaining instances of 'Schema' suffix
    .replace(/Schema(Schema)?([^a-zA-Z]|$)/g, '$2')
    // Clean up 'Public' prefix in type exports
    .replace(/\bPublic([A-Z][a-zA-Z]*)/g, '$1')
    // Clean up any lowercase 'public' in type names
    .replace(/\bpublic([a-z][a-zA-Z]*)/g, '$1');
}

function fixErrors(content) {
  return content.replace(/z\.Zod<Json>/g, 'z.ZodType<Json>');
}

const projectId = process.env.DB_REF;

if (!projectId) {
	console.error("DB_REF is not defined in .env.local");
	process.exit(1);
}


const schemasPath = "src/lib/db/schemas.ts";
const schemasDtsPath = "src/lib/db/schemas.d.ts";
const supabaseCommand = `supabase gen types typescript --project-id ${projectId} --schema public`;
const supazodCommand = `npx supazod -i src/lib/db/db.types.ts -o ${schemasPath} -t ${schemasDtsPath} -s public,schema_a,schema_b`;

exec(supabaseCommand, (error, stdout, stderr) => {
	if (error) {
		console.error(`Error executing Supabase command: ${error.message}`);
		return;
	}
	if (stderr) {
		console.warn(`stderr: ${stderr}`);
	}
	console.log(`Supabase types generated successfully`);

	// Write Supabase types to file
	fs.writeFileSync("src/lib/db/db.types.ts", stdout);

	// Run supazod command after successful type generation
	exec(supazodCommand, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing Supazod command: ${error.message}`);
			return;
		}
		if (stderr) {
			console.warn(`stderr: ${stderr}`);
		}
		console.log(`Supazod schemas generated successfully`);

		// Clean up schemas.ts
		const schemasContent = fs.readFileSync(schemasPath, 'utf8');
		const cleanedSchemasContent = cleanupTypeNames(schemasContent);
		const fixedSchemasContent = fixErrors(cleanedSchemasContent);
		fs.writeFileSync(schemasPath, fixedSchemasContent);

		// Clean up schemas.d.ts
		const schemasDtsContent = fs.readFileSync(schemasDtsPath, 'utf8');
		const cleanedSchemasDtsContent = cleanupTypeNames(schemasDtsContent);
		const fixedSchemasDtsContent = fixErrors(cleanedSchemasDtsContent);
		fs.writeFileSync(schemasDtsPath, fixedSchemasDtsContent);

		console.log('Schema names cleaned up successfully');
	});
});
