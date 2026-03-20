---
trigger: always_on
---

# Project Constraints

This file defines the core rules, architectural decisions, and constraints for this project. These guidelines should be followed by developers and AI agents alike.

## 1. Technology Stack
- **Frontend**: Next.js (App Router/Pages), React, TypeScript
- **Styling**: Tailwind CSS / Vanilla CSS
- **Backend/Database**: Supabase (Postgres)
- **AI Tools**: MCP (Model Context Protocol) for GitHub, Jira, and Supabase

## 2. Coding Standards
- Strictly use **TypeScript** and strongly type all interfaces and database returns.
- Prefer functional components and hooks.
- Keep components modular and reusable.

## 3. Database & Security (Supabase)
- **Project Reference**: `japgyxasmqtjwzkmkwfa`
- Write explicit **Row Level Security (RLS)** policies for all tables.
- All database schema changes should be structured as Supabase migrations.
- Avoid passing raw generic queries when secure Postgres procedures or RPCs can be used.

## 4. MCP & AI Tool Constraints (Crucial)
- **Dynamic Scoping**: Only use MCP tools if their corresponding keys exist in the local `.env`.
- **Supabase Tool**: 
    - Restricted to project `japgyxasmqtjwzkmkwfa`.
    - Use `SERVICE_ROLE_KEY` for schema discovery and migrations, but respect the `public` schema default.
- **GitHub Tool**: 
    - Only search or modify files within the current repository context. 
    - Do not access external or private repos unless explicitly named.
- **Jira Tool**: 
    - If `JIRA_URL` is missing from `.env`, treat this tool as **Dormant**. Do not attempt to create tickets or query boards.
- **Safety**: Never execute `DROP` or `TRUNCATE` commands via MCP without a "Yes/No" confirmation from the user.

---
*(Add or update any project-specific constraints, rules, or workflows above this line)*