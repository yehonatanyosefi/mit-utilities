# Supabase-Zod Type Generator

A utility to automatically generate Zod schemas and TypeScript types from your Supabase database schema.

Created by Yonatan Lavy  
MIT License

## Overview

This utility streamlines the process of keeping your TypeScript types and Zod schemas in sync with your Supabase database schema. It:

1. Generates TypeScript types from your Supabase database
2. Converts these types into Zod schemas
3. Cleans up the generated type names for better readability
4. Handles common type conversion issues

## Prerequisites

- Node.js (v14 or higher)
- A Supabase project
- `supabase` CLI installed globally
- `supazod` package installed

## Installation
bash
npm install --save-dev supazod dotenv


## Setup

1. Create a `.env.local` file in your project root:
env
DB_REF=your_supabase_project_id


2. Add the script to your project:
bash
mkdir scripts
cp generateTypes.js scripts/


3. Add the following script to your `package.json`:
json
{
"scripts": {
"generate": "node generateTypes.js"
}
}


## Usage

1. Run the generator:
bash
npm run generate


This will:
- Generate TypeScript types from your Supabase schema
- Convert them to Zod schemas
- Clean up type names
- Output the results to:
  - `src/lib/db/db.types.ts` (Supabase types)
  - `src/lib/db/schemas.ts` (Zod schemas)
  - `src/lib/db/schemas.d.ts` (TypeScript type definitions)

## Configuration

The script uses two main commands:

1. Supabase type generation:
bash
supabase gen types typescript --project-id ${projectId} --schema public

2. Supazod conversion:
bash
supazod -i src/lib/db/db.types.ts -o src/lib/db/schemas.ts -t src/lib/db/schemas.d.ts -s public,schema_a,schema_b


### Customizing Type Cleanup

The script includes two cleanup functions:
javascript
function cleanupTypeNames(content) {
// Cleans up type names by removing prefixes and suffixes
}
function fixErrors(content) {
// Fixes common type conversion issues
}


You can modify these functions to match your naming conventions.

## Generated Files Structure

### schemas.ts
Contains Zod schemas for all your database tables and types:
- Table schemas (e.g., `UserProfilesRow`, `AppsRow`)
- Insert/Update schemas
- Relationship definitions
- Enum schemas

### schemas.d.ts
Contains TypeScript type definitions derived from the Zod schemas:
- Type exports for all schemas
- Relationship types
- Enum types

## Error Handling

The script includes error handling for:
- Missing environment variables
- Supabase CLI errors
- Supazod conversion errors
- File system operations

## Contributing

Feel free to submit issues and pull requests to improve this utility.

## License

MIT License - see LICENSE file for details.

## Author

Yonatan Lavy
