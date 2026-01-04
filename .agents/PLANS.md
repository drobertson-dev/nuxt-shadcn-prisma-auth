# Codex Execution Plans (ExecPlans)

This document describes the requirements for an execution plan ("ExecPlan"), a design document that a coding agent can follow to deliver a working feature or system change. Treat the reader as a complete beginner to this repository: they have only the current working tree, AGENTS.md, and the single ExecPlan file you provide. There is no memory of prior plans and no external context.

Both the planning agent and the executing agent have the same tools: they can list files, read files, search, run the project, and run tests (and any other tools explicitly described in AGENTS.md). The planning agent is expected to use these tools during planning to validate feasibility, discover environment gaps, and surface blockers early.

## How to use ExecPlans, PLANS.md, and AGENTS.md

Before authoring or implementing an ExecPlan in this repository:

- If `AGENTS.md` exists at the repository root, read it fully. It defines project-specific rules, conventions, and capabilities.
- If `PLANS.md` exists, read it fully. It defines how ExecPlans must be structured and maintained.

When authoring an executable specification (ExecPlan), follow PLANS.md **to the letter** and obey all relevant constraints from AGENTS.md. Be thorough in reading (and re-reading) source material to produce an accurate specification. When creating a spec, start from the skeleton and flesh it out as you do your research. Where AGENTS.md contains rules that matter for this task (for example, preferred directories, naming conventions, or test commands), restate the relevant parts inside the ExecPlan so that the ExecPlan remains self-contained.

When implementing an executable specification (ExecPlan), do not prompt the user for "next steps", "should I continue?", or similar confirmations. Simply proceed to the next milestone as long as the preconditions and assumptions documented in the ExecPlan still hold. Keep all sections up to date, add or split entries in the `Progress` list at every stopping point to affirmatively state the progress made and next steps. Resolve ambiguities autonomously when possible, and commit frequently.

When discussing an executable specification (ExecPlan), record decisions in a log in the spec for posterity; it should be unambiguously clear why any change to the specification was made. ExecPlans are living documents, and it should always be possible to restart from **only** the ExecPlan and no other work.

When researching a design with challenging requirements or significant unknowns:

- First, use your tools: read code, search the repository, read AGENTS.md, run the project, and run tests where applicable.
- Only after that, collect all remaining uncertainties into a concise list of clarifying questions.
- Ask these questions **once, before you finalize the plan**, rather than piecemeal during execution.
- If the user's request seems not feasible in this environment, do **not** write a "happy-path" plan to pacify the user. Instead, explain why it cannot be done, present evidence, and propose alternative solutions that fit within the user's constraints.

Read the source code of libraries by finding or acquiring them, research deeply, and include prototypes or small spikes when they materially reduce risk or clarify ambiguous behavior.

## Requirements

### Non‑negotiable requirements

- Every ExecPlan must be fully self-contained. Self-contained means that in its current form it contains all knowledge and instructions needed for a novice to succeed, including any critical rules from AGENTS.md.
- Every ExecPlan is a living document. Contributors are required to revise it as progress is made, as discoveries occur, and as design decisions are finalized. Each revision must remain fully self-contained.
- Every ExecPlan must enable a complete novice to implement the feature end-to-end without prior knowledge of this repo.
- Every ExecPlan must produce a demonstrably working behavior, not merely code changes to "meet a definition".
- Every ExecPlan must define every term of art in plain language or not use it.
- Every ExecPlan must be **honest about feasibility**. It must not describe steps that are known to be impossible with the tools and environment available.

Purpose and intent come first. Begin by explaining, in a few sentences, why the work matters from a user's perspective: what someone can do after this change that they could not do before, and how to see it working. Then guide the reader through the exact steps to achieve that outcome, including what to edit, what to run, and what they should observe.

The agent executing your plan can list files, read files, search, run the project, and run tests. It does not know any prior context and cannot infer what you meant from earlier milestones. Repeat any assumption you rely on. Do not point to external blogs or docs; if knowledge is required, embed it in the plan itself in your own words. If an ExecPlan builds upon a prior ExecPlan and that file is checked in, you may incorporate it by reference, but you must still copy any details required to implement the plan without reading the prior file.

### Feasibility, preconditions, and blockers

Before finalizing an ExecPlan, the planning agent **must** perform a pre-flight feasibility check using the same tools as the executing agent:

- Use repository inspection, AGENTS.md, and commands (for example, running the application, tests, or tooling) to confirm how the project is built, run, and tested.
- Identify the **test situation**:
  - If tests exist, state the test command(s) and their current status.
  - If no tests exist or the test harness is unclear, state that explicitly and either:
    - Plan to introduce a minimal test harness, **or**
    - Describe clear manual validation steps instead.
- List all **preconditions** that must hold for the work to succeed (for example, specific tools, runtimes, environment variables, external services, or credentials). For each precondition, state whether you have verified it in this environment.
- Identify any **known blockers or impossible steps**. If the requested outcome depends on a capability that does not exist (for example, restricted network access, missing external API, tools not present, or files not in this repo), say so clearly and provide evidence (command output, missing files, or constraints from AGENTS.md).
- If the main goal is blocked, do **not** pretend it is achievable. Instead:
  - Narrow the scope to what is actually possible and clearly state the new goal, **or**
  - Produce a "blocked" ExecPlan that documents the blockers and proposes realistic alternatives or follow-up tasks.

Where you cannot verify something but must rely on it, mark it as an explicit **assumption** and explain what will break if the assumption is wrong.

## Formatting

Format and envelope are simple and strict. Each ExecPlan must be one single fenced code block labeled as `md` that begins and ends with triple backticks. Do not nest additional triple-backtick code fences inside; when you need to show commands, transcripts, diffs, or code, present them as indented blocks within that single fence. Use indentation for clarity rather than code fences inside an ExecPlan to avoid prematurely closing the ExecPlan's code fence. Use two newlines after every heading, use `#` and `##` and so on, and correct syntax for ordered and unordered lists.

When writing an ExecPlan to a Markdown (.md) file where the content of the file **is only** the single ExecPlan, you should omit the triple backticks.

Write in plain prose. Prefer sentences over lists. Avoid checklists, tables, and long enumerations unless brevity would obscure meaning. Checklists are permitted only in the `Progress` section, where they are mandatory. Narrative sections must remain prose-first.

## Guidelines

Self-containment and plain language are paramount. If you introduce a phrase that is not ordinary English ("daemon", "middleware", "RPC gateway", "filter graph"), define it immediately and remind the reader how it manifests in this repository (for example, by naming the files or commands where it appears). Do not say "as defined previously" or "according to the architecture doc." Include the needed explanation here, even if you repeat yourself.

Avoid common failure modes. Do not rely on undefined jargon. Do not describe "the letter of a feature" so narrowly that the resulting code compiles but does nothing meaningful. Do not outsource key decisions to the reader. When ambiguity exists, resolve it in the plan itself and explain why you chose that path. Err on the side of over-explaining user-visible effects and under-specifying incidental implementation details.

Anchor the plan with observable outcomes. State what the user can do after implementation, the commands to run, and the outputs they should see. Acceptance should be phrased as behavior a human can verify ("after starting the server, navigating to <http://localhost:3000/health> returns HTTP 200 with body `OK`") rather than internal attributes ("added a HealthCheck route"). If a change is internal, explain how its impact can still be demonstrated (for example, by running tests that fail before and pass after, and by showing a scenario that uses the new behavior).

Specify repository context explicitly. Name files with full repository-relative paths, name functions and modules precisely, and describe where new files should be created. If touching multiple areas, include a short orientation paragraph that explains how those parts fit together so a novice can navigate confidently. When running commands, show the working directory and exact command line. When outcomes depend on environment, state the assumptions and provide alternatives when reasonable.

Validation is not optional. Include instructions to run tests, to start the system if applicable, and to observe it doing something useful. Describe comprehensive testing for any new features or capabilities. Include expected outputs and error messages so a novice can tell success from failure. Where possible, show how to prove that the change is effective beyond compilation (for example, through a small end-to-end scenario, a CLI invocation, or an HTTP request/response transcript). State the exact test commands appropriate to the project’s toolchain and how to interpret their results. If the repository currently has no tests and adding a test harness is out of scope, you must clearly describe manual validation steps and their limitations.

Capture evidence. When your steps produce terminal output, short diffs, or logs, include them inside the single fenced block as indented examples. Keep them concise and focused on what proves success. If you need to include a patch, prefer file-scoped diffs or small excerpts that a reader can recreate by following your instructions rather than pasting large blobs.

## Milestones and user interaction

Milestones are narrative, not bureaucracy. If you break the work into milestones, introduce each with a brief paragraph that describes the scope, what will exist at the end of the milestone that did not exist before, the commands to run, and the acceptance you expect to observe. Keep it readable as a story: goal, work, result, proof. Progress and milestones are distinct: milestones tell the story, progress tracks granular work. Both must exist. Never abbreviate a milestone merely for the sake of brevity; do not leave out details that could be crucial to a future implementation.

Each milestone must be independently verifiable and incrementally implement the overall goal of the execution plan.

While implementing an ExecPlan:

- Do **not** pause after each milestone to ask the user for approval or "next steps".
- Only ask the user for input if:
  - A documented assumption in the ExecPlan is violated by new evidence, **and**
  - You cannot reasonably resolve the discrepancy from repository context or AGENTS.md.
- When you do need to ask, present:
  - What you expected, what you observed, and which assumption failed.
  - Your recommended way forward.
  - The minimal set of choices the user needs to make.

All other progress must be captured in the `Progress` section of the ExecPlan itself, not through repeated conversational prompts.

## Living plans and design decisions

- ExecPlans are living documents. As you make key design decisions, update the plan to record both the decision and the thinking behind it. Record all decisions in the `Decision Log` section.
- ExecPlans MUST contain and maintain a `Progress` section, a `Surprises & Discoveries` section, a `Decision Log`, and an `Outcomes & Retrospective` section. These are NOT optional.
- When you discover optimizer behavior, performance tradeoffs, unexpected bugs, or inverse/unapply semantics that shaped your approach, capture those observations in the `Surprises & Discoveries` section with short evidence snippets (test output is ideal).
- If you change course mid-implementation, document why in the `Decision Log` and reflect the implications in `Progress`. Plans are guides for the next contributor as much as checklists for you.
- At completion of a major task or the full plan, write an `Outcomes & Retrospective` entry summarizing what was achieved, what remains, and lessons learned.

## Skeleton of a good ExecPlan

```md
# <Short, action-oriented description>

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

If PLANS.md and/or AGENTS.md files are checked into the repo, reference their paths here from the repository root and note that this document must be maintained in accordance with them. Restate any rules from AGENTS.md that are critical to this task so this ExecPlan remains self-contained.

## Purpose / Big Picture

Explain in a few sentences what someone gains after this change and how they can see it working. State the user-visible behavior you will enable.

## Feasibility, Preconditions, and Risks

Summarize the pre-flight checks you performed using the available tools (file inspection, AGENTS.md, running commands and tests) and what they showed.

State:

- Preconditions that must hold in order for the plan to succeed (tools, services, credentials, versions).
- Which preconditions you have actually verified in this environment, and how you verified them.
- The current state of tests (for example, "ran `npm test` from the repo root; there are no existing tests" or "tests exist and pass/fail as follows").
- Any work that is blocked or impossible in the current environment, with concrete evidence (missing files, failing commands, restricted services).
- Any assumptions you must make that you could not verify, and the impact if they are wrong.

If the original goal is fully or partially blocked, state that explicitly and describe realistic alternative outcomes or reduced-scope goals.

If you still need information from the user that you cannot obtain from the repository and tools, list those questions here in one concise group before the plan is finalized.

## Progress

Use a list with checkboxes to summarize granular steps. Every stopping point must be documented here, even if it requires splitting a partially completed task into two (“done” vs. “remaining”). This section must always reflect the actual current state of the work.

- [x] (2025-10-01 13:00Z) Example completed step.
- [ ] Example incomplete step.
- [ ] Example partially completed step (completed: X; remaining: Y).

Use timestamps to measure rates of progress.

## Surprises & Discoveries

Document unexpected behaviors, bugs, optimizations, or insights discovered during implementation. Provide concise evidence.

- Observation: …
  Evidence: …

## Decision Log

Record every decision made while working on the plan in the format:

- Decision: …
  Rationale: …
  Date/Author: …

## Outcomes & Retrospective

Summarize outcomes, gaps, and lessons learned at major milestones or at completion. Compare the result against the original purpose. Note explicitly if any planned work remained blocked and why.

## Context and Orientation

Describe the current state relevant to this task as if the reader knows nothing. Name the key files and modules by full path. Define any non-obvious term you will use. Do not refer to prior plans. If AGENTS.md contains project-specific structure or rules relevant to this task (for example, where new commands live, how agents should behave), summarize those rules here.

## Plan of Work

Describe, in prose, the sequence of edits and additions. For each edit, name the file and location (function, module) and what to insert or change. Keep it concrete and minimal. Make sure every step is compatible with the feasibility and preconditions you listed above.

## Concrete Steps

State the exact commands to run and where to run them (working directory). When a command generates output, show a short expected transcript so the reader can compare. This section must be updated as work proceeds.

Include commands for:

- Setting up or confirming the environment if needed.
- Running the application or relevant services.
- Running tests (or, if there are no tests, whatever manual checks you specified).

## Validation and Acceptance

Describe how to start or exercise the system and what to observe. Phrase acceptance as behavior, with specific inputs and outputs. If tests are involved, say "run <project’s test command> and expect <N> passed; the new test <name> fails before the change and passes after>".

If there are no automated tests, describe clear, repeatable manual validation steps and what outcomes distinguish success from failure.

## Artifacts and Notes

Include the most important transcripts, diffs, or snippets as indented examples. Keep them concise and focused on what proves success.

## Interfaces and Dependencies

Be prescriptive. Name the libraries, modules, and services to use and why. Specify the types, interfaces, and function signatures that must exist at the end of the milestone. Prefer stable names and paths.

In crates/foo/bar.ts, define:

    function Signature here
```

If you follow the guidance above, a single, stateless agent, or a human novice, can read your ExecPlan from top to bottom and produce a working, observable result using only the working tree, AGENTS.md, and the ExecPlan itself. That is the bar: SELF-CONTAINED, SELF-SUFFICIENT, NOVICE-GUIDING, OUTCOME-FOCUSED, and HONEST ABOUT FEASIBILITY.

When you revise a plan, you must ensure your changes are comprehensively reflected across all sections, including the living document sections, and you must write a note at the bottom of the plan describing the change and the reason why. ExecPlans must describe not just the what but the why for almost everything.
