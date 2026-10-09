# NEURONEX: Google Antigravity Master Prompt

Copy everything from the next line through the end of this document into Google Antigravity.

---

You are an autonomous senior full-stack engineering team responsible for upgrading the existing NEURONEX application into a production-oriented, AI-powered, real-time maritime freight intelligence platform. Act as a Senior Software Architect, AI/ML Architect, Backend Engineer, Frontend Engineer, Data Engineer, UI/UX Designer, Security Engineer, QA Engineer, and DevOps Engineer.

Your first responsibility is to understand the repository that is actually present. Inspect before changing anything. Do not assume that requested features already exist, do not represent mock or historical values as live data, and do not blindly rewrite the application.

## 1. Ground truth: repository audit

The repository root is `NEURONEX`. Preserve the working application while evolving it incrementally.

### Backend currently present

- `backend/main.py` creates a FastAPI application titled `Neuronex Master Application`.
- It imports `database.engine`, `database.Base`, and `api_routes.router`, creates SQLAlchemy tables at import time, includes the API router under `/api`, and serves `frontend/index.html` plus `frontend/assets` as static content.
- The server can be started from `backend` with `python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload`.
- `backend/api_routes.py` currently exposes exactly:
  - `GET /api/health`
  - `GET /api/optimize/history`
  - `POST /api/optimize`
- `OptimizationInput` accepts only `feature_1`, `feature_2`, and `feature_3` as floats.
- `POST /api/optimize` invokes `ml_model.optimize`, then persists the three inputs and prediction in `optimization_requests`.
- Error handling rolls back the database transaction and returns a generic HTTP 500 response.
- `backend/database.py` loads only `backend/.env`, defaults to SQLite at `backend/neuronex.db`, enables SQLite cross-thread access, and otherwise accepts a SQLAlchemy `DATABASE_URL`.
- `backend/models.py` defines only the `OptimizationRequest` table with `id`, three float features, nullable `prediction_result`, and `created_at`.
- `backend/requirements.txt` contains FastAPI, Uvicorn, SQLAlchemy, PyMySQL, XGBoost, pandas, scikit-learn, and python-dotenv. It does not contain Alembic, Redis, Celery, an AI SDK, WebSocket-specific infrastructure, testing packages, or observability packages.
- `backend/ml_model.py` loads `backend/xgboost_model.json`. If absent, it trains an XGBoost regressor on 100 rows of random three-column data with a synthetic linear target plus random noise. The existing model therefore is a generic dummy regression model, not a freight forecast or maritime optimization model. The committed model artifact is approximately 41 KB.

### Frontend currently present

- There is no visible frontend source tree, `package.json`, lockfile, TypeScript source, or build configuration. The frontend is a prebuilt artifact.
- `frontend/index.html` loads `assets/index-CyzSREEe.js` and `assets/index-g-Qlphjb.css`, and loads Google Fonts `DM Sans` and `Space Grotesk`.
- The compiled JavaScript contains client-side screens/navigation for dashboard, forecast, vessels/fleet, ports, contracts, risk, and simulator-style workflows. Treat these as existing UI behavior to preserve, but inspect the bundle at runtime before claiming any page is backed by a real API.
- The bundle contains route strings including `/forecast`, `/vessels`, `/ports`, `/contracts`, and `/risk`; the FastAPI catch-all currently serves the same HTML shell for such routes.
- The compiled frontend uses browser `localStorage` and does not show evidence of an existing WebSocket or `EventSource` realtime connection.
- `frontend/assets/api-integration.js` injects a fixed “Neuronex optimizer” panel into the page. It calls `/api/health` and `/api/optimize`, submits only the three synthetic features, and labels the result as a saved optimization. Preserve or replace this behavior with a real branded workflow rather than leaving duplicate or misleading controls.
- The bundle and styles contain substantial client-side visualization and domain-shaped data. Audit each value and classify it as backend data, static fixture, derived client calculation, historical data, predicted data, or demo data. Do not call it live until a server-side provider and freshness metadata exist.
- `frontend/__manus__/debug-collector.js` captures console logs, network requests, and UI events and posts them to `/__manus__/logs`. Review whether this instrumentation is appropriate for production, ensure sensitive data cannot leak, and keep it disabled or protected outside an explicitly configured development mode.
- The visual direction is currently a dark/green maritime-style interface with responsive CSS and bundled imagery. Preserve the recognizable NEURONEX identity while making the product more coherent and enterprise-grade.

### Data and repository state currently present

- `backend/neuronex.db` exists as a small local SQLite database. Preserve it during migration and inspect its schema and rows before applying changes.
- There is no Alembic migration directory or migration configuration. Introduce migrations; do not rely on `Base.metadata.create_all` as the production migration strategy.
- There is no authentication, authorization, user model, request identity, rate limiting, secure headers, structured logging, request ID middleware, or documented CORS policy.
- There is no `.env.example`, Dockerfile, docker-compose file, CI configuration, deployment manifest, README describing the current system, or frontend package manifest visible in the repository.
- There is no Git history to rely on. Before major changes, create a local checkpoint if the environment supports it, but never destroy existing files or the existing SQLite database.

This baseline is authoritative until your own inspection proves a detail otherwise. At the start, produce a short audit report in `docs/architecture-audit.md` containing verified findings, runtime observations, route inventory, data provenance classification, risks, and a list of unknowns. Do not spend the entire task only writing the report: proceed to implementation after the audit.

## 2. Non-negotiable operating rules

1. Inspect the complete repository and run the current application before changing behavior.
2. Preserve all currently working routes and features. Existing routes found at runtime must continue to work, including `/`, `/forecast`, `/vessels`, `/ports`, `/contracts`, `/risk`, `/api/health`, `/api/optimize`, and `/api/optimize/history`, unless an improved equivalent is provided with backward compatibility.
3. Reuse existing model, database, and frontend behavior where it is valid. Replace only dummy or misleading behavior with a documented migration path.
4. Make incremental changes in coherent phases. Keep the application runnable after each phase.
5. Never commit or expose API keys. Keys belong only in server-side environment variables or a secret manager.
6. Never invent live freight prices, BDI values, bunker prices, vessel availability, AIS locations, congestion, weather, or external API responses.
7. Never use random numbers for a live-looking update. A deterministic fixture is acceptable only in explicit demo mode and must be marked `DEMO`.
8. Every data value must carry provenance metadata: `value`, `unit`, `timestamp`, `source`, `status`, `freshness_seconds`, and `confidence` where meaningful. Allowed statuses are `LIVE`, `CACHED`, `HISTORICAL`, `PREDICTED`, `DEMO`, and `UNAVAILABLE`.
9. External provider failure must produce a visible stale/unavailable state, not a fabricated fallback.
10. Do not add infrastructure merely for appearance. Choose the smallest architecture that meets reliability and scale requirements, and explain each new service.
11. Update requirements, environment examples, documentation, migrations, tests, and deployment files together with code.
12. Run backend tests, frontend type checking/build, API smoke tests, and database migration checks. Fix errors before completion.

## 3. Target product

NEURONEX should become a serious commercial SaaS platform for maritime procurement and freight intelligence. It should combine:

- Global command center dashboard
- NEURONEX AI Copilot
- Freight and market intelligence
- Current price and market-indicator views
- Forecasting with calibrated uncertainty and explanations
- Vessel discovery and voyage optimization
- Port compatibility and operational intelligence
- Contract comparison and scenario analysis
- Risk scoring, drivers, actions, and alerts
- Notifications and threshold rules
- Realtime updates with explicit freshness states
- Demo mode that remains useful without provider keys

The design must be original and branded for NEURONEX. It may take inspiration from dense operational intelligence products, but it must not copy another product's UI.

## 4. Target architecture

Use a modular monolith first, with clear boundaries that can later be extracted. Do not split into microservices before the boundaries and operational need are demonstrated.

### Backend layers

- `app/main.py`: application factory, lifespan, middleware, routers, static serving.
- `app/core/`: settings, logging, request IDs, security, CORS, feature flags, demo mode.
- `app/api/`: versioned REST routers and WebSocket/SSE endpoints.
- `app/schemas/`: Pydantic request and response contracts.
- `app/models/`: SQLAlchemy models.
- `app/db/`: engine, sessions, migrations, repositories.
- `app/services/`: market, freight, vessel, port, contract, risk, forecast, notification, conversation, and copilot services.
- `app/providers/`: provider interfaces, adapters, normalization, validation, provider health.
- `app/ai/`: provider abstraction, tool registry, policy guardrails, prompt/context construction, cost controls.
- `app/workers/`: scheduled ingestion and model jobs.
- `tests/`: unit, integration, contract, provider, AI-tool, and API tests.

Use an application factory and lifespan hooks. Do not create database tables during module import in production. Keep the existing import/start command working through a compatibility entrypoint if necessary.

### Data flow

External provider -> adapter -> schema validation -> normalization -> provenance -> database -> cache -> REST/WebSocket/SSE -> React UI.

For model inference:

Validated historical/current data -> feature pipeline -> versioned model -> prediction plus uncertainty/explanations -> persisted forecast run -> API/UI/Copilot.

For AI:

User message plus page context -> intent/policy check -> backend tool call(s) -> validated application data -> grounded response with citations/metadata. A language model may explain tool results; it may not substitute a guess for missing data.

### Storage and infrastructure choice

- Keep SQLite for local/demo mode.
- Support PostgreSQL as the production default. Keep MySQL compatibility only where it costs little and is tested.
- Use Alembic migrations.
- Use Redis only when needed for cache, rate limiting, pub/sub, or job coordination.
- Start scheduled jobs with APScheduler for local/single-process deployments. Add Celery/RQ plus Redis only if ingestion volume or reliability requires a separate worker.
- Use WebSocket for interactive bidirectional Copilot/status needs, or SSE for server-to-client market/alert streams. Prefer SSE for market updates and notifications if no bidirectional stream is required; use WebSocket for the Copilot conversation channel. Implement polling fallback.

## 5. Database and migration requirements

Preserve `optimization_requests` and existing rows. Add a migration that maps or retains it; do not drop or silently rewrite it.

Add normalized tables with foreign keys, timestamps, indexes, and appropriate uniqueness constraints:

- `users`, `roles`, `user_roles`
- `conversations`, `messages`, `conversation_context`
- `data_sources`, `provider_health`, `ingestion_runs`
- `market_prices`, `market_indicators`, `freight_rates`
- `vessels`, `ports`, `port_status`, `ais_positions`
- `forecasts`, `forecast_runs`, `model_versions`, `feature_snapshots`
- `contracts`, `contract_scenarios`, `optimization_requests`
- `risk_events`, `risk_assessments`, `alerts`, `notifications`, `notification_rules`

Store source, observed time, ingested time, status, confidence, and raw/provider reference IDs where appropriate. Do not store unrestricted provider payloads without retention and privacy controls. Add indexes for route/date, port/status time, vessel availability, source/time, and unread notifications.

Implement an idempotent migration/backfill plan. Verify migration from a copy of the current SQLite database and provide PostgreSQL instructions. Add repository tests for preservation and rollback.

## 6. Provider and realtime data architecture

Create interfaces such as:

- `MarketDataProvider`
- `FreightRateProvider`
- `BalticIndexProvider`
- `BunkerFuelProvider`
- `CommodityProvider`
- `FXProvider`
- `WeatherProvider`
- `PortProvider`
- `VesselProvider`
- `AISProvider`

Implement a deterministic `DemoProvider` and at least one production adapter only when credentials and documented API contracts are available. Do not pretend an unconfigured provider is live.

Research current provider documentation before implementation and record the decision in `docs/data-providers.md`, including provider, datasets, API style, auth, pricing/free tier, update frequency, rate limits, geographic coverage, licensing, SLA, limitations, and production suitability. Suitable candidates to investigate, not to invent integrations for, include:

- Baltic Exchange or a licensed freight-data distributor for BDI and freight assessments.
- Kpler, Vortexa, or LSEG/Refinitiv for commercial commodity and shipping intelligence where licensed.
- Shippo or similar only for unrelated logistics needs; do not assume it provides maritime freight truth.
- MarineTraffic, VesselFinder, Spire Maritime, or exact AIS provider documentation for vessel positions and availability.
- Portcast, project44, or port/terminal data providers for congestion and ETA where coverage is suitable.
- NOAA, ECMWF-derived commercial services, Tomorrow.io, or Meteomatics for weather, subject to terms.
- ECB, Open Exchange Rates, or another licensed FX source for currency data.
- EIA or a licensed bunker source for fuel benchmarks, recognizing that bunker prices are not identical to retail fuel prices.

If a provider is not licensed, unavailable, too expensive, or lacks required coverage, implement its interface plus `UNAVAILABLE` or `DEMO` behavior and document the limitation. Never call a random public endpoint as a production data source.

Normalize all provider outputs into common schemas. Add retries with bounded exponential backoff, timeouts, circuit breakers, rate-limit handling, idempotency, validation, freshness checks, and provider health metrics. Cache data with a TTL appropriate to its source; cached data must remain `CACHED`, never `LIVE`.

Implement schedules conservatively:

- 30 seconds only for configured critical streams that support that cadence.
- 1-5 minutes for configured port/vessel conditions.
- 15-60 minutes for market indicators.
- Daily for data quality, feature computation, and model evaluation.

Expose realtime channels for market updates, price changes, port status, vessel updates, risk alerts, forecast changes, and notifications. Include heartbeat, reconnect with backoff, sequence or event IDs, stale transitions, connection status, and polling fallback. The UI must show LIVE, CACHED, HISTORICAL, PREDICTED, DEMO, or UNAVAILABLE explicitly.

## 7. API contracts

Version new routes under `/api/v1` while keeping compatibility routes for the existing API. Use consistent Pydantic schemas, pagination, filtering, validation errors, request IDs, and documented OpenAPI descriptions.

At minimum implement and test:

- `GET /api/health` and `GET /api/v1/health`
- `GET /api/market/overview`
- `GET /api/market/freight`
- `GET /api/market/fuel`
- `GET /api/market/bdi`
- `GET /api/market/commodities`
- `GET /api/vessels`, `GET /api/vessels/{id}`
- `POST /api/vessels/optimize`
- `GET /api/ports`, `GET /api/ports/{id}`, `GET /api/ports/{id}/status`
- `GET /api/forecast`, `POST /api/forecast`
- `POST /api/optimize` as a backward-compatible adapter and a maritime-aware optimization endpoint
- `POST /api/risk/analyze`
- `POST /api/contracts/compare`
- `POST /api/scenarios`
- `GET /api/alerts`, `GET /api/notifications`, and notification-rule CRUD
- `POST /api/chat` or a WebSocket equivalent
- `GET /api/conversations`, `POST /api/conversations`, `GET/PATCH/DELETE /api/conversations/{id}`
- realtime SSE/WebSocket endpoints with authenticated access

Return provenance on every market/operational value. Return explicit error codes for provider unavailable, stale data, invalid route, unsupported demo capability, and model unavailable.

## 8. NEURONEX AI Copilot

Implement a server-side multi-provider abstraction such as `AIProvider` with adapters for Anthropic Claude, OpenAI, Google Gemini, and a local model where practical. Configure with environment variables:

```env
APP_ENV=development
DEMO_MODE=true
DATABASE_URL=sqlite:///./backend/neuronex.db
REDIS_URL=
AI_PROVIDER=none
AI_MODEL=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
CORS_ORIGINS=http://localhost:5173,http://localhost:8000
```

Create/update `.env.example` with placeholders only. Load secrets only on the backend. Never put keys in JavaScript, HTML, logs, telemetry, database fixtures, or Git.

The Copilot must be domain-aware, tool-first, and context-aware. It must understand the current route, selected route/cargo/vessel/port/contract, date range, user permissions, and demo/live status. Store conversation ID, messages, timestamps, selected context, tool calls, tool results metadata, token/cost metadata where safe, and summarization state.

Register typed backend tools including:

- `get_current_freight_rate`
- `get_freight_history`
- `get_market_overview`
- `get_bdi`
- `get_bunker_price`
- `get_commodity_price`
- `get_fx_rate`
- `get_vessels`
- `get_vessel_details`
- `optimize_vessel`
- `check_port_compatibility`
- `get_port_status`
- `get_port_congestion`
- `get_port_waiting_time`
- `forecast_freight_rate`
- `explain_forecast`
- `compare_contracts`
- `calculate_contract_savings`
- `calculate_risk`
- `get_risk_factors`
- `run_scenario_analysis`
- `get_active_alerts`
- `get_notifications`

Tool execution must occur on the backend, be permission-checked, schema-validated, time-bounded, logged without secrets, and return provenance. The model cannot call arbitrary URLs, execute code, write SQL, or bypass access controls.

For “Which vessel should I use for 70,000 MT Australia to Paradip?”, the orchestrator must retrieve candidate vessels, validate cargo capacity, check draft/LOA/beam and port restrictions, obtain route and market inputs, calculate estimated cost and risk, optimize, and explain the ranked result with timestamps and sources. If a required input or source is unavailable, ask a targeted clarification or say that the answer cannot be determined.

The Copilot must refuse to state a current value when the current value was not retrieved. It may provide a clearly labeled historical, predicted, cached, demo, or unavailable answer. Implement prompt-injection defenses, output grounding checks, tool-result citations, maximum tool rounds, token limits, context summarization, response caching for safe queries, model routing for simple versus complex tasks, and per-user/provider rate limits.

## 9. Intelligence services

### Forecasting

Build a `ForecastService` around real feature data. Start by improving XGBoost only if sufficient historical data exists; do not claim the existing dummy model is a forecast. Compare against a naive seasonal baseline and consider LightGBM, statistical models, or a time-series model only when validation shows improvement. Version datasets, feature definitions, models, and training runs.

Forecast inputs may include historical freight rates, BDI, bunker prices, commodities, port congestion, vessel availability, demand, seasonality, weather, geopolitical risk, FX, route, cargo, and historical voyages. Return prediction, lower/upper bounds, confidence, feature importance, model version, timestamp, provenance, validation metrics, and forecast horizon. Use conformal intervals, quantile models, or another defensible uncertainty method where appropriate. Do not fabricate feature importance; use SHAP only with a compatible model and tested pipeline.

### Vessel optimization

Accept cargo quantity/type, route, draft, LOA, beam, desired ETA, fuel assumptions, availability window, cost constraints, and risk preferences. Rank feasible vessels by compatibility, estimated total voyage cost, fuel consumption, ETA, congestion exposure, weather/operational risk, and confidence. Return infeasibility reasons and an explanation for every recommendation.

### Port intelligence

Model port status with congestion, waiting vessels, average waiting time, berth utilization, weather/operational status, draft restrictions, estimated delay, trend, timestamp, source, and freshness. Support comparison, alternative-port recommendation, compatibility checks, and a map/heatmap only when coordinates and data provenance exist.

### Contract intelligence

Support spot, short-term, medium-term, and long-term contracts. Calculate expected cost, savings, flexibility, market exposure, risk, break-even, and future-rate sensitivity. Support scenario inputs such as fuel +15%, freight +20%, demand -10%, and port congestion +25%, with transparent assumptions and financial impact.

### Risk engine

Create market, fuel, port, vessel, weather, geopolitical, demand, and FX risk factors. Return overall score, level, probability, impact, drivers, confidence, source timestamps, and recommended actions. Separate model-derived risk from rules. Never produce a confident score when required data is unavailable; degrade confidence and disclose missing factors.

### Alerts and notifications

Implement persisted alerts and configurable notification rules for freight changes, market moves, port congestion, vessel availability, risk changes, forecast changes, and contract opportunities. Support threshold, percentage-change, freshness, severity, deduplication, acknowledgement, mute windows, and in-app delivery first. Keep email/webhook delivery behind explicit configuration.

## 10. Frontend and UX requirements

Because the current frontend is a compiled artifact without source or package metadata, first recover or recreate a maintainable React + TypeScript source tree and build configuration without deleting the working static build until the new build is verified. Pin versions, add a lockfile, and document the build.

Use a typed API client, route-level loading/error/empty states, query caching, abortable requests, and a single source of truth for live status. Choose a state/query library only if justified. Keep domain calculations on the backend when they affect decisions; frontend calculations may format or visualize API results.

Preserve current navigation and improve it into:

- Command center/dashboard
- Market intelligence
- Freight forecast
- Vessel intelligence and optimization
- Port intelligence
- Contract intelligence
- Risk center
- Scenario simulator
- Alerts/notifications
- NEURONEX AI Copilot

Add a Ctrl/Cmd+K command palette supporting navigation, “forecast Australia Paradip”, “find cheapest vessel”, “show high-risk ports”, “compare contracts”, “show live market”, “open risk center”, and Copilot invocation. Commands must show permission, loading, failure, and unavailable states.

Create an enterprise interface with strong hierarchy, dense but scannable operational tables, restrained glass effects, meaningful motion, accessible charts, source/freshness badges, live connection status, stale warnings, skeletons, and useful empty states. Maintain the NEURONEX maritime visual identity rather than copying Bloomberg, Palantir, or another product. Do not use decorative visuals that imply unavailable data.

The market dashboard must show ticker cards for freight, BDI, fuel, coal, iron ore, FX, and configured indicators, each with current value, change, percentage, trend, time range (1D/7D/30D/90D/1Y), source, timestamp, status, and confidence. Charts must update through the realtime channel and handle stale/disconnected states.

The Copilot must be mobile-friendly, support conversation history/new/rename/delete, render tool/data citations, show whether an answer is live/cached/historical/predicted/demo/unavailable, and retain page context without leaking secrets.

Support desktop, laptop, tablet, and mobile. Use semantic HTML, keyboard navigation, visible focus, ARIA labels, color contrast, reduced-motion support, accessible form errors, and chart summaries for screen readers.

## 11. Security, reliability, and observability

- Configure restrictive CORS from environment settings; never use wildcard credentials.
- Add authentication and role-based authorization before exposing user-specific conversations, alerts, data sources, or provider configuration.
- Validate all request payloads and query parameters with Pydantic.
- Use SQLAlchemy parameterized queries and least-privilege database credentials.
- Add secure headers, bounded request body sizes, rate limiting, timeouts, and safe exception responses.
- Redact keys, authorization headers, cookies, prompts containing secrets, and sensitive user data from logs and debug collectors.
- Disable or protect Manus debug collection in production.
- Add structured JSON logs, request IDs, API latency, model latency, external-provider latency, cache hit/miss, ingestion status, forecast version, and Copilot tool-call metrics.
- Add health/readiness checks that distinguish application, database, cache, provider, worker, and model health.
- Add retention controls for raw provider payloads, messages, telemetry, and logs.

## 12. Testing and verification

Add backend tests for:

- Existing compatibility routes and health behavior
- Database migrations and preservation of `optimization_requests`
- Provider normalization, freshness, retries, timeout, and unavailable states
- Forecast baselines, intervals, model version, explainability, and insufficient-data behavior
- Vessel compatibility and optimization ranking
- Port compatibility/status and alternative recommendation
- Contract comparison and scenario calculations
- Risk drivers, confidence degradation, and alerts
- Copilot tool schemas, authorization, tool-first behavior, grounding, provider failure, and no-hallucination cases
- Realtime event ordering, reconnect, heartbeat, stale transitions, and polling fallback

Add frontend unit/component tests for loading, errors, status badges, charts, route context, command palette, Copilot, mobile layout, accessibility, and API client behavior. Add Playwright E2E tests for dashboard -> market -> forecast -> vessel optimization -> contract optimization -> risk -> Copilot -> realtime update. Use deterministic fixtures and a controlled fake clock; never use random values in tests that represent live market behavior.

Add linting, formatting, type checking, OpenAPI/schema contract checks, and a frontend production build. Add a smoke script that starts the backend, verifies every compatibility and new endpoint, verifies an SSE/WebSocket connection, exercises a Copilot tool call in demo mode, and shuts down cleanly.

## 13. Demo mode

`DEMO_MODE=true` must allow the system to run without external keys. Demo providers must use stable, documented fixtures, not random values. Every demo response must include `status=DEMO`, an explicit source such as `NEURONEX Demo Provider`, a timestamp, and a visible DEMO indicator in the UI. Demo data must be sufficient to exercise charts, optimization, forecast, risk, contracts, alerts, and Copilot tools. Never label demo data LIVE.

When `DEMO_MODE=false` and a provider is unconfigured or unavailable, return `UNAVAILABLE` with a user-readable reason and a server log correlation ID. Do not silently fall back to demo data.

## 14. Deployment and documentation

Create or update:

- `README.md` with current architecture, local setup, demo mode, API docs, test commands, and provider configuration.
- `.env.example` with placeholders only.
- `Dockerfile` and `docker-compose.yml` only if the resulting setup is tested. Include API, PostgreSQL, Redis only when used, and worker only when used.
- CI configuration for backend tests, frontend build/typecheck, migrations, linting, and security checks.
- Deployment notes for reverse proxy/TLS, secrets, database backups, migrations, health checks, workers, cache, scaling, and log/metric collection.
- `docs/architecture-audit.md`, `docs/architecture.md`, `docs/data-providers.md`, `docs/api.md`, and `docs/demo-mode.md`.

The application must run locally with SQLite and no external keys, and must have a clear production configuration using PostgreSQL and managed secrets.

## 15. Phased implementation plan

Execute in this order, keeping the application runnable:

### Phase 1: Audit and baseline

Run the current backend, inspect every frontend route in a browser, capture API behavior, classify data provenance, record the route inventory, and add a baseline smoke test. Create a checkpoint.

### Phase 2: Source and architecture recovery

Recover/recreate maintainable React TypeScript source from the compiled UI where possible, add build tooling and typed API client, establish backend application factory/settings/logging, and preserve static serving and current routes.

### Phase 3: Persistence and domain contracts

Add Alembic, preserve and test existing SQLite data, define schemas/repositories/models, add the domain tables and provenance fields, and add compatibility adapters for current optimization records.

### Phase 4: Provider and demo infrastructure

Implement provider interfaces, deterministic demo fixtures, normalization, freshness, cache policy, provider health, error taxonomy, and `.env.example`. Document real provider research before integrating any live provider.

### Phase 5: Backend intelligence

Implement market, freight, vessel, port, contract, scenario, forecast, risk, alert, and notification services with typed APIs and tests. Replace dummy model naming/behavior with an honest versioned model pipeline; preserve the old endpoint during migration.

### Phase 6: Realtime

Implement SSE or WebSocket channels, event schemas, heartbeats, reconnect, stale transitions, and polling fallback. Verify status and provenance from server to UI.

### Phase 7: AI provider and Copilot

Implement the multi-provider server-side abstraction, backend tool registry, grounding policy, conversation storage, context-aware orchestration, cost controls, and demo-mode Copilot. Add no-hallucination tests.

### Phase 8: Frontend product upgrade

Build the command center, market dashboard, forecast, vessel, port, contract, risk, alert, conversation, and Copilot experiences. Add responsive/accessibility behavior, source badges, loading/error/empty states, and realtime UI updates.

### Phase 9: Security and observability

Add authentication/authorization, CORS, secure headers, rate limiting, request IDs, structured logs, provider/model metrics, health/readiness, retention, and production-safe debug behavior.

### Phase 10: Verification and deployment

Run migrations on a database copy, all automated tests, frontend typecheck/build, API and E2E smoke flows, accessibility checks, security checks, and a clean demo-mode deployment. Fix failures and update documentation before declaring completion.

## 16. Acceptance criteria

Do not declare completion until all of the following are demonstrated with commands, tests, screenshots or recorded runtime observations where appropriate:

- Existing application starts successfully.
- Existing UI routes and compatibility API routes work.
- Existing SQLite data and `optimization_requests` records are preserved.
- A real migration system exists and has been tested.
- Backend, database, model, cache/worker, and provider health are observable.
- AI provider is configurable and all keys remain server-side.
- Copilot works in demo mode and can call NEURONEX tools.
- Data-dependent Copilot answers are grounded in tool results and disclose source/time/status.
- Missing data produces `UNAVAILABLE`, not a fabricated answer.
- Realtime architecture works with connection status, heartbeat, reconnect, stale state, and polling fallback.
- Market dashboard values are correctly labeled LIVE, CACHED, HISTORICAL, PREDICTED, DEMO, or UNAVAILABLE.
- No random numbers are used to simulate live updates.
- Forecasting returns uncertainty, provenance, model version, and honest explainability.
- Vessel, port, contract, scenario, and risk services work with validated inputs and tests.
- Alerts and configurable notifications work.
- Command palette works on keyboard and mobile layouts remain usable.
- External API failures, timeouts, rate limits, and missing credentials are handled visibly.
- Loading, error, empty, stale, disconnected, and unavailable states are implemented.
- Backend tests, frontend tests, E2E tests, linting, type checking, and production build pass.
- No secrets are committed or exposed in frontend bundles/logs.
- Documentation, environment examples, migration instructions, provider decisions, and deployment instructions are current.

## 17. Definition of done report

At the end, provide a concise implementation report containing:

1. Verified baseline findings and any corrections to the audit.
2. Files/modules added or changed.
3. Architecture decisions and why they were chosen.
4. Existing routes preserved and new routes added.
5. Provider integrations and which ones are demo/unavailable/live.
6. Database migration and data-preservation result.
7. Model versions, training/evaluation result, and limitations.
8. Copilot providers, tools, grounding behavior, and cost controls.
9. Realtime transport and fallback behavior.
10. Test, lint, typecheck, build, migration, and E2E command results.
11. Remaining risks, known limitations, and production prerequisites.

Do not claim production readiness if any acceptance criterion is unverified. Leave the repository in a runnable state and show exact commands to start local demo mode and the production-oriented stack.
