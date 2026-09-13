---
title: Alisha Sprinkle Korba Portfolio — PRD Addendum
companion_to: PRD.md
updated: 2026-09-13
---

# PRD Addendum

This file preserves depth that informs downstream work (story content, architecture,
UX) but does not belong in the PRD's own narrative — options-considered detail,
mechanism/transport decisions, and full source material for selected stories. The PRD
itself carries only the concise, product-level summary; this file carries the substance
behind it.

---

## Engineering Story Candidates — Source Material

### ES-1: Auth.RcmAppAccessWatcher (selected — see PRD §5.1)

**Source:** `ASK - Portfolio.pdf`, supplied by Alisha 2026-09-12. Owner confirmed
verbally: "Nothing here is proprietary" — the system name, product names, and
architecture detail below are cleared for public use. This answers PRD §14.3 item 4
(public-safe details) for this story specifically.

#### Overview

`Auth.RcmAppAccessWatcher` is an event-driven synchronization system ensuring user
access to applications in **InmarOne** (a unified healthcare platform) accurately
reflects authorization data from **RCM**, the system of record. Alisha designed and
delivered the system end-to-end as a solo engineer, establishing the first integration
pattern between RCM and InmarOne using CDC (Change Data Capture) and pub/sub.

**Scope:** Organization-wide initiative tied to the InmarOne launch; first external
system to integrate with InmarOne's access APIs; processed ~2,000 users/day at launch,
~4,500 users/day as of 2026-03-22; near real-time synchronization.

**Key outcomes:** Eliminated manual access provisioning across systems; ensured
consistent, self-healing access state at login; reduced risk of revenue loss from
misconfigured access; established a reusable event-driven integration pattern adopted
by other teams.

#### Problem & context (business-to-engineering translation — FR-5)

InmarOne unified multiple healthcare applications into a single portal but had no
visibility into user authorization, which lived in RCM. This created automated-sync
gaps, manual/error-prone provisioning, inconsistent user experience (missing or wrong
app access), and risk of lost product adoption and upsell opportunities. APIs existed
for integration, but no implementation or pattern did — making the effort both
high-ambiguity and high-visibility (InmarOne was a top organizational priority).

#### Ownership & role (FR-6)

Sole engineer and technical lead: end-to-end architecture and design, CDC/event-driven
pipeline implementation, InmarOne API integration, infrastructure via Terraform (IaC),
cross-team collaboration with the InmarOne platform team (no prior integration
relationship existed), documentation and org-level knowledge sharing. Established the
reference integration pattern later reused by other teams; presented it org-wide.

#### System architecture (condensed)

Authorization model: Features → Roles → Users; app access derived from a Role
containing the matching AppLink Feature. Multi-level evaluation required since a
change at any layer (User, UserRole, FeatureRole) can affect access.

Pipeline: SQL Server (RCM Auth DB) → Debezium Server (daemon on a GCP VM, first of its
kind in the org) captures row-level CDC → per-table GCP Pub/Sub topics (each with a
BigQuery subscription for history/debugging/replay) → Cloud Run (Python) services split
by responsibility (FeatureRole Service, UserRole Service, User Service) → User Service
aggregates effective access and calls InmarOne APIs.

Key architectural insight: CDC events are treated as **signals, not full state** —
services reconstruct access state from database relationships + API calls rather than
applying deltas, so processing is idempotent and correct even with duplicate or
out-of-order events. RCM stays the source of truth; incorrect InmarOne state
self-heals on the next event or login. Single-instance execution per service avoids
grant/revoke race conditions (a deliberate throughput-for-correctness tradeoff).

Observability: centralized Grafana dashboard (VM CPU, oldest unacked Pub/Sub message,
messages processed/24h, crash frequency), GCP alerting on stale messages/anomalies,
BigQuery-backed audit trail.

#### Key technical decisions & tradeoffs (engineering judgment — FR-7)

1. **CDC (Debezium) vs polling/API hooks** — chosen because the database is the lowest
   common denominator across every write path (UI, APIs, one-time scripts), guaranteeing
   complete coverage; tradeoff: added infra complexity, CDC events carry minimal context
   requiring downstream enrichment.
2. **Event-driven (pub/sub) vs synchronous integration** — decouples RCM from InmarOne,
   improves scalability/fault tolerance, enables replay; tradeoff: eventual consistency,
   requires idempotency/ordering handling.
3. **Debezium on a VM vs containerized runtime** — chosen for better documentation,
   faster implementation under time constraints, and cost parity for a continuously
   running process; tradeoff: less flexible scaling, restart required for config changes.
   **Explicitly flagged in hindsight (see below) as the one decision she'd revisit.**
4. **Persistent external disk for CDC offset/schema state** — avoids full reprocessing
   on restart; tradeoff: added infra complexity.
5. **Rejected GCP Datastream → storage-pipeline alternative** — would have added
   unnecessary storage cost and latency for non-analytical data; kept the pipeline lean
   and purpose-built instead.
6. **Centralized JSON mapping for `ApplicationGlobalId` ↔ `AppLink Feature`** — no
   mapping existed between the two systems' identifiers; solved with a centralized,
   validated, environment-specific mapping shared across services. Tradeoff: introduced
   a configuration-management responsibility — she'd push for a schema-level fix given
   more influence (see hindsight).
7. **Single-instance concurrency** — prevents grant/revoke race conditions at the cost
   of parallelism.

#### Ambiguity handling (FR-8)

"Ambiguity as First Integrator": no prior examples of integrating with InmarOne's APIs,
requiring iterative collaboration and validation to build the relationship and the
integration from scratch. Also handled incomplete CDC payloads (messages lacked full
business context, requiring additional API calls/computation) and data-consistency
risk (solved via idempotent processing + limited concurrency).

#### Impact & results (outcome)

Eliminated manual dual-system provisioning and reduced human error; accurate app access
at login reduced user confusion and support load; protected revenue by ensuring correct
product visibility; enabled scalable onboarding of users and applications. Scale grew
from ~2,000 to ~4,500 users/day (as of 2026-03-22) with near real-time sync maintained
throughout.

#### Leadership & influence thread (may also inform the Leadership & Enablement path)

First team to integrate with InmarOne's APIs; influenced cross-team integration
patterns; built reusable Terraform modules; delivered an org-wide architecture
presentation; established a reusable CDC + pub/sub pattern other teams adopted. Also
extracted a reusable Python library (`inmarone` API clients/helpers, `rcm`-specific
logic) with 100% unit test coverage integrated into CI/CD — reduced duplication,
improved reliability, enabled faster/safer iteration org-wide.

#### Hindsight / what she'd do differently (reflection)

1. **Deployment strategy** — would run a deeper cost/runtime comparison between VM and
   containerized (Cloud Run/GKE) deployment rather than optimizing primarily for
   time-to-delivery, given more time.
2. **Upstream data model alignment** — the `ApplicationGlobalId` mapping was a pragmatic
   workaround; given more influence/time, she'd advocate adding `ApplicationGlobalId`
   directly to the Applications table alongside AppLink Feature, eliminating the
   derived-mapping drift risk entirely.
3. **Concurrency model** — single-instance execution has proven sufficient at current
   scale, but she'd explore safe parallelism (ordering guarantees, idempotent
   reconciliation, deduplication) for higher throughput while preserving correctness.
4. **Business-level observability** — operational monitoring is strong; she'd add
   business-level metrics (sync latency, RCM/InmarOne drift detection, error rates tied
   to user impact) to bridge system health and business impact visibility.
5. **Configuration friction** — VM restarts for config changes are a byproduct of the
   deployment choice; she'd address it as part of resolving #1, plus more dynamic
   configuration management.

This gives an honest "I'd defend the call under the constraints I had, and here's
specifically what I'd change with more time or influence" — exactly the evidence-of-
reasoning bar in PRD §6.

---

### ES-2: Terraform-based Azure Infrastructure-as-Code platform (selected — see PRD §5.1)

**Source:** PDF supplied by Alisha, 2026-09-13. **Confidentiality constraint (explicit,
not verbal-clearance-by-default like ES-1):** the underlying product/system is
proprietary and its name **must never appear** in any portfolio-facing or planning
artifact. It is referred to only as "the platform" throughout — this is a stand-in
label, not a public-safe alias to reuse elsewhere. Cloud provider, tool, and generic
Azure primitive names (Terraform, Azure, Cosmos DB, Container Apps, Key Vault, Azure
DevOps, Akamai) are treated as public-safe technologies (FR-20) since they are
third-party product names, not the employer's own system name. Business-domain
specifics beyond "a multi-service application platform" are intentionally omitted here
as an extra margin of safety, not because Alisha flagged them — confirm with her before
loosening this if the domain framing would strengthen the story.

#### Overview

The platform initially ran on a manually provisioned, temporary Azure development
environment supporting ~11 microservices, with no equivalent QA, UAT, or Production
environments and no standardized provisioning approach. The initiative's own
requirements had identified Infrastructure-as-Code as a need, but the team had no prior
experience with either large-scale cloud infrastructure conversion or Terraform. Alisha
brought prior experience in both (from a GCP background) and led the effort end-to-end:
Terraform architecture, reusable modules, deployment pipelines, migration strategy,
documentation, and engineering standards.

**Timeline:** ~2 months from manual Azure infrastructure to a reusable Terraform
platform with existing services migrated onto it; ~3 months to Dev, QA, and UAT
environments provisioned on the new architecture; the same foundation later supported
Production.

**Scope:** ~11 existing microservices; Azure Container Apps, Cosmos DB, User Assigned
Managed Identities (UAMI), Key Vault, and service-specific storage; shared environment
infrastructure, Terraform remote state, and backend architecture; reusable Terraform
modules and Azure DevOps deployment pipelines; Dev/QA/UAT environments with the same
foundation later supporting Production; engineering documentation, ADRs, and a
microservice conversion guide.

**Key outcomes:** replaced manual provisioning with Terraform-based IaC; established
repeatable infrastructure patterns across services and environments; migrated existing
services without a risky immediate cutover; expanded from a temporary Dev-only
environment to Dev/QA/UAT in ~3 months; standardized Azure resource tagging (improving
security-scan accuracy and cloud cost attribution); built an extensible foundation that
later absorbed Akamai integration, friendly-URL mappings, and multi-zone Production
requirements without a redesign; became the platform's infrastructure technical lead as
it was adopted.

#### Problem & context (business-to-engineering translation — FR-5)

The application ran in a temporary, manually constructed Azure Dev environment (a
Container App Environment, a single shared Key Vault, ~11 microservices each with its
own Cosmos DB and UAMI, some with additional storage) with no QA, UAT, or Production
equivalent. Key challenges: manual, non-version-controlled provisioning; configuration
drift even within the single Dev environment (similar microservices sized differently
with no technical justification); no multi-environment model (QA/UAT/Production needed
more than copying resources — a consistent, reproducible-with-variation architecture);
a cloud-platform transition (Alisha's prior infrastructure experience was primarily GCP,
requiring translation into Azure-specific patterns — Container Apps, Cosmos DB, UAMI,
Key Vault, Azure RBAC, Azure DevOps); and cost/governance needs with no codified
mechanism for consistent resource tagging or environment-cost attribution.

#### Ownership & role (FR-6)

Led the Infrastructure-as-Code initiative and owned the technical implementation
end-to-end: designed the overall Terraform architecture and state strategy; defined
repository boundaries for environment Terraform, reusable modules, pipeline templates,
and service-owned infrastructure; built shared environment Terraform and reusable
service modules; designed the Azure DevOps Terraform pipelines and deployment flow;
migrated existing manually provisioned services onto the new patterns; established
identity, RBAC, provider, tagging, and resource-ownership standards; wrote ADRs,
repository READMEs, and a microservice conversion wiki; taught teammates the
architecture and reviewed infrastructure changes; led the critical-data-resource
protection strategy after a destructive Cosmos DB incident (below). As developers began
independently using and extending the modules, the role evolved into infrastructure
technical lead for the platform.

#### System architecture (condensed)

The Terraform platform separates infrastructure by lifecycle, ownership, and reuse:

- **Environment infrastructure** — shared resources (resource groups, shared Key Vault
  resources, shared platform services, environment config, asset tagging, outputs
  consumed by services) managed at the environment level, distinct from
  service-specific infrastructure.
- **Reusable Terraform modules** — common Azure patterns encapsulated so service
  Terraform expresses intent at a higher level instead of every team hand-configuring
  each primitive.
- **Service-owned infrastructure** — each microservice repo owns its own Terraform,
  consuming shared modules/outputs/pipeline templates, preserving team autonomy without
  re-deriving platform standards.
- **Terraform state, isolated by environment** — each environment gets its own Resource
  Group, Storage Account, and state container ("one environment = one backend"),
  favoring explicit isolation over minimizing Azure resource count.
- **Identity separated from workload** — UAMI lives in its own module, separate from
  the primary microservice module, because identity policy and workload infrastructure
  are different responsibilities. Guiding rule: *the module that owns a resource's
  lifecycle also owns access grants scoped to that resource* — this avoided circular
  Terraform dependencies while keeping permission ownership legible.
- **Infrastructure vs. application deployment** — Terraform owns Container App
  infrastructure/config and provisions it with a known-good placeholder image,
  deliberately ignoring subsequent image changes; CI/CD pipelines own and replace the
  running application image, decoupling infrastructure apply cycles from
  (much more frequent) application releases.

#### Key technical decisions & tradeoffs (engineering judgment — FR-7)

1. **Reusable platform first vs. service-by-service conversion** — chose to establish
   shared architecture/modules/pipelines/conventions *before* scaling conversion across
   services, since translating each manually created resource directly into Terraform
   would have codified existing inconsistencies. Tradeoff: more upfront architectural
   work, in exchange for fewer repeated decisions and less drift later.
2. **Environment-isolated Terraform backends** — separate Resource Group/Storage
   Account/state container per environment, for clear boundaries, simpler RBAC, and
   lower risk of targeting the wrong state. Tradeoff: more Azure resources than a
   shared backend; operational clarity was judged more valuable.
3. **Repository separation by concern** — separate repos for environment Terraform,
   reusable modules, pipeline templates, and service-specific infrastructure, for clear
   ownership boundaries. Tradeoff: more repositories to maintain and document.
4. **Opinionated baseline microservice module** — one module bundling the
   infrastructure every service universally needed (Cosmos DB, API/Handler Container
   Apps, APIM integration, supporting Key Vault secrets, resource-scoped permissions)
   rather than one module per Azure primitive, optimizing for simple adoption and rapid
   migration. Tradeoff: less composable. **Explicitly flagged as the one architectural
   decision she'd most strongly reconsider** (see hindsight below).
5. **Separate identity from microservice infrastructure** — UAMI and workload
   infrastructure as distinct modules, since identity is a distinct security concern
   (including platform-wide policy like container-registry access). Tradeoff: services
   must compose multiple modules instead of one all-in-one module.
6. **Resource-scoped permission ownership** — a module grants access to the resources
   it creates, rather than centralizing grants in the identity module (which would need
   to reference resources that don't exist yet, creating circular dependencies).
   Tradeoff: permissions are distributed across modules, but the dependency direction
   stays clean and ownership stays explicit.
7. **Terraform owns infrastructure; CI/CD owns application images** — decouples the
   much-higher-frequency application release cadence from Terraform apply cycles.
   Tradeoff: Terraform state intentionally does not reflect the currently deployed
   application image.
8. **Explicit Terraform providers** — required explicit provider references instead of
   relying on Terraform's implicit resolution, so subscription targeting is visible in
   review and unintended-provider deploys are less likely. Tradeoff: more verbose call
   sites, in exchange for visible correctness.

#### Ambiguity handling (FR-8)

No one on the team had converted large-scale manually provisioned infrastructure to
Terraform before, and Alisha's own infrastructure background was GCP-based, requiring
active translation into Azure-specific patterns while designing the platform. There was
also no existing multi-environment model to extend — the shared architecture that would
have to reproduce Dev/QA/UAT/Production consistently, while still allowing
per-environment configuration, had to be designed from scratch and validated by
migrating real services rather than by following a known pattern.

**Migration strategy under risk:** rather than cutting over immediately, Alisha
designed a four-phase migration so the manually provisioned and Terraform-managed
environments could run in parallel: (1) establish the platform (backend architecture,
repo structure, shared infrastructure, reusable modules, pipelines, documentation/ADRs);
(2) build a new permanent Dev environment via Terraform while the temporary one stayed
available, migrating existing microservices onto it; (3) validate parity — automated
and manual tests ran against both environments in parallel for several sprints, with no
meaningful behavioral differences identified, providing evidence before the temporary
environment was retired; (4) expand the validated patterns to provision Dev, QA, and
UAT within ~3 months, with Production following later on the same foundation.

#### Impact & results (outcome)

Within ~2 months: Terraform architecture established, shared infrastructure codified,
reusable modules available, deployment pipelines in place, existing services migrated
or mid-migration. Within ~3 months: Dev, QA, and UAT running on the Terraform-managed
architecture. Production rollout was straightforward because lower environments had
already validated the same reusable patterns. The team shifted its default practice
from manual Azure configuration to Infrastructure-as-Code; infrastructure became
version-controlled, repeatable, reviewable, and documented. Standardized resource
tagging improved security-scan accuracy and cloud-cost attribution. The foundation
proved extensible — later requirements (a third-party CDN integration, friendly-URL
mappings, multi-zone Production) were absorbed into the existing model rather than
forcing a redesign.

#### Leadership & influence thread (may also inform the Leadership & Enablement path)

Created the reusable Terraform modules and pipeline patterns that became the platform's
standard; wrote ADRs, repository READMEs, and a microservice conversion wiki so
infrastructure knowledge would not stay concentrated with one person; taught teammates
how the architecture worked and reviewed their infrastructure changes; guided Azure
infrastructure decisions as the team expanded into additional environments and
Production. The strongest validation: developers subsequently performed migrations and
built additional modules independently, using the established patterns, without
requiring Alisha to implement every change herself — which is what changed her role
from "engineer who did the conversion" to infrastructure technical lead for the
platform.

**A durable engineering-judgment moment worth surfacing on its own (candidate for a
decision/outcome highlight, not just a footnote):** during an infrastructure change, a
Cosmos DB account rename caused Terraform to *replace* the resource (Azure does not
support in-place account rename) — deleting the existing account and its data. Alisha
led the investigation into protecting critical data-bearing resources from this class
of destructive Terraform operation, and found no single safeguard was sufficient:
`prevent_destroy` blocks accidental replacement only while the resource stays defined
in configuration (and can be bypassed by removing the resource block); Azure Resource
Locks add a layer, especially when managed outside Terraform's own identity, but
neither provides recovery. She designed a layered protection strategy instead: apply
`prevent_destroy` to critical resources; detect destructive changes in Terraform plans;
require additional approval before destructive operations execute; and establish
backup/restore automation so data is recoverable if preventative controls fail —
shifting the platform's approach from relying on safe definitions alone to treating
destructive-operation protection as a defense-in-depth problem (prevention, detection,
authorization, and recovery, addressed separately).

#### Hindsight / what she'd do differently (reflection)

1. **Revisit the opinionated microservice module boundary** — the single baseline
   module optimized for fast adoption during a rapid transition, and the team's rapid
   uptake validated that tradeoff at the time. With the benefit of operating the
   platform, this is the decision she'd most strongly reconsider: she'd evaluate
   decomposing it (Cosmos DB, Container Apps, APIM integration, supporting resources)
   into smaller modules with a higher-level composition layer, trading a little
   consumption-time simplicity for long-term composability, smaller module
   responsibilities, and clearer resource-lifecycle boundaries.
2. **A separate Key Vault for externally managed dependencies** — the current design
   has values that create circular provisioning dependencies (a secret must exist
   before some infrastructure can be created, but the value itself is produced by that
   same provisioning workflow), forcing some steps to happen after the primary
   environment Terraform completes. She'd introduce a third Key Vault dedicated to
   secrets/keys whose lifecycle depends on external/third-party systems, so more
   resources stay fully managed by environment Terraform and the dependency graph
   simplifies. Reflection: resource grouping should account for lifecycle and
   dependency direction, not just conceptual ownership.
3. **Keep moving knowledge from individual expertise into platform guardrails** — the
   project began because the team lacked Terraform/cloud-conversion experience; the
   next stage is encoding more of that judgment into module contracts, automated
   validation, pipeline guardrails, documentation, and reusable examples, so teams can
   safely do common infrastructure work without needing an infrastructure specialist
   for every change — not so every engineer becomes a Terraform expert, but so the
   platform itself carries more of the judgment.

**Key lesson (candidate pull-quote):** Infrastructure-as-Code makes infrastructure
changes reproducible, but reproducibility does not inherently make those changes safe —
for stateful infrastructure, prevention, detection, authorization, and recovery have to
be designed for separately.

This gives the same "I'd defend the call under the constraints I had, and here's
specifically what I'd change with more time or influence" bar as ES-1, from a different
technical angle (platform/infrastructure architecture vs. event-driven data
synchronization) — useful breadth if both are selected for the Engineering path.
