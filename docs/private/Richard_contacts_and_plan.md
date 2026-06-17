# PRIVATE — Companies to contact, partnership suggestions and roadmap to take LukaScope to the next level

> For Richard Waters (richardwaters9049) — Confidential draft. Do not publish or share without prior approval.

Date: 2026-06-17

## 1) Primary aims of this document
- Recommend companies and organisations to contact for clinical pilots, partnerships, cloud/infra, and commercialisation.
- Prioritised list of product and engineering improvements required to mature LukaScope from prototype → clinical pilot → production.
- Estimated effort classifications and notes on regulatory & governance work needed.

## 2) Companies / organisations to contact (grouped by role)

### A. Clinical / Diagnostic partners (UK + global)
- NHS pathology networks (local hospital pathology departments and integrated pathology networks)
  - Why: access to annotated clinical slides, operational context, potential pilot sites; strong clinical credibility.
  - Approach: research collaboration or exploratory pilot; emphasise data governance and patient-safety protections.
- Oxford University Hospitals NHS Trust / Cambridge University Hospitals (Addenbrooke’s) / Guy’s & St Thomas’ / Imperial College NHS Trust
  - Why: strong haematology/pathology research groups, potential academic collaborations and access to datasets.
- Private pathology labs (UK): Synnovis, The Doctors Laboratory
  - Why: quicker contracting cycles for pilots than NHS may allow.

### B. Diagnostic instrumentation and reagent companies
- Roche Diagnostics
- Siemens Healthineers
- Abbott Diagnostics
- Beckman Coulter
- Sysmex
  - Why: they supply scanners, image acquisition systems and workflows — potential integration (SDKs/APIs) or co-marketing.

### C. Digital pathology / AI-in-pathology specialists
- Proscia
- PathAI
- Ibex Medical Analytics
- Paige
  - Why: experience with clinical validation, regulatory pathways, cloud deployments. Potential licensing, tech partnerships, or acquisition interest.

### D. Cloud / AI infrastructure partners
- Amazon Web Services (AWS) — Health AI programmes, S3, SageMaker, HealthLake
- Microsoft Azure — Azure Health Data Services, ML Ops
- Google Cloud — Vertex AI, Healthcare APIs
- NVIDIA — model serving and GPU infra, inference tools (NVIDIA Triton)
- Lambda Labs / CoreWeave / Paperspace — GPU-access providers for training and inference
  - Why: scalable storage, GPU training, secure healthcare offerings and compliance tools.

### E. Ancillary partners (security, data governance, regulatory)
- Consultancy/regulatory: Emergo by UL, IQVIA, MedTech Europe consultants
- Legal / data governance: law firms with healthcare practice (local to pilot site)
  - Why: regulatory, clinical validation, and procurement support.

### F. Potential early adopters / purchasers
- Private clinics specialising in haematology
- Community laboratories seeking triage/automation to reduce manual review load
- Research centres that need dataset curation tools

## 3) Suggested approach to outreach
- Stage 0 (research): contact academic pathology groups to set up data-access pilot agreements and refine lab workflow integration. Offer to co-author a methods/validation paper.
- Stage 1 (clinical pilot): approach a single NHS pathology department or private lab for a non-commercial pilot. Provide an easy-to-deploy environment (Docker/VM) and clear data handling agreements.
- Stage 2 (commercial / integration): after positive pilot data, approach diagnostic vendors and cloud providers for deeper integration (scanner SDKs, federation, edge inferencing).

Materials to prepare before outreach: short clinical one-pager, security/data-flow diagram, proof-of-concept results and minimal validation metrics, sample UI screenshots, and one or two short use-case success stories.

## 4) Priority improvements to reach clinical-pilot readiness (ordered by priority)
> Effort estimates: S = small, M = medium, L = large

### A. Security, data governance & compliance (Priority: Critical) — Effort: M–L
- Implement proper authentication/authorisation (OAuth2 / OIDC), RBAC and session management.
- Add audit logs for all user actions (uploads, annotations, result export).
- Create GDPR-compliant data workflows (pseudonymisation, retention policies) and DPA templates for partners.
- Regulatory planning: prepare for MHRA/UKCA (or CE marking if applicable) and clinical evaluation documentation.

Why: Clinical partners will not proceed without robust governance and security.

### B. Replace local file storage with object storage + migration (Priority: High) — Effort: M
- Add S3-compatible storage support (AWS S3, MinIO) and update storage abstraction in backend/storage.py.
- Migrate artefact storage (uploads, heatmaps, models) and add lifecycle/backups.

Why: Scalability, multi-instance deployments and easier sharing with cloud partners.

### C. Database hardening & migrations (Priority: High) — Effort: S–M
- Add Postgres support as production default and use Alembic for schema migrations.
- Add automated migration tests in CI.

Why: Stable production DB + rollback/migration safety.

### D. Authentication & clinical user management (Priority: High) — Effort: M
- Implement OAuth2 / OpenID Connect and support for enterprise logins (e.g., Azure AD) and local fallback for pilots.
- Add role definitions (clinician/reviewer/admin) and user invite/workflow.

Why: Secure and auditable access for clinical staff.

### E. Model serving & low-latency inference (Priority: High) — Effort: M–L
- Decide model-serving approach: FastAPI model endpoints, BentoML, TorchServe, or Triton for GPU inference.
- Add versioned model registry and A/B testing support.

Why: predictable latency, reproducible models and testing in pilot workflows.

### F. Observability & reliability (Priority: High) — Effort: S–M
- Add metrics (Prometheus), logs (structured logs + ELK/Cloud provider) and alerting for worker queues.
- Harden queue retry, backoff, dead-letter handling.

Why: Operational readiness.

### G. Workflow & annotation improvements (Priority: M) — Effort: S–M
- Add an annotation UI for reviewers to correct or label model outputs, with active-learning export.
- Add dataset export in standard formats (COCO, Pascal VOC, CSV) for retraining.

Why: Build a human-in-the-loop loop for continuous model improvement.

### H. Explainability & visual outputs (Priority: M) — Effort: S–M
- Improve heatmap generation and provide overlay transparency controls, region summaries, and confidence calibration visualisations.

Why: Clinician trust and auditability.

### I. Interoperability with lab systems (Priority: M) — Effort: M–L
- Add HL7/FHIR or LIS connectivity to receive sample metadata / return results.

Why: Integration into routine lab workflows reduces friction for adoption.

### J. Clinical validation & study design (Priority: Critical) — Effort: L
- Run a prospective/retrospective study against labelled ground truth; define sensitivity/specificity targets and acceptance criteria.
- Build standard operating procedures and analysis plans for clinical validation.

Why: Essential before clinical use and for regulatory submission.

### K. Scalability: orchestration and devops (Priority: M) — Effort: M
- Add k8s Helm charts, CI/CD pipelines, automated builds, container scanning, and infra-as-code (Terraform).

Why: Production deployments at scale and multi-cloud readiness.

### L. Advanced ML: segmentation, instance detection & federated learning (Priority: lower / future) — Effort: L
- Add precise cellular segmentation, instance-level detection, and consider federated learning for multi-site training without centralising PHI.

Why: Improve detection granularity and address data sharing barriers.

## 5) Rough timeline to a clinical pilot (example)
- 0–2 months: governance, authentication, Postgres migration, S3 storage, minimal observability, and a secure pilot deployment.
- 2–4 months: clinical pilot with one lab, annotation UI, model serving improvements and iterative retraining.
- 4–8 months: expanded pilot, more sites, regulatory documentation start, and production infra hardening.

## 6) Commercialisation / go-to-market suggestions
- Offer the product as (a) a lab-side triage tool integrated with LIS, (b) an enterprise hosted SaaS for private labs, or (c) a research/annotation platform for academic groups.
- Pricing models: per-seat for reviewers + per-sample processing fees, or SaaS subscription with model retraining credits.
- Consider initial proof-of-value offers (no-cost pilot, co-authored publication) to gain clinical credibility.

## 7) Quick-win engineering checklist (first 6–8 weeks)
- Add S3 support + config and test data migration.
- Implement simple OAuth2/OIDC sign-in (Azure AD) and RBAC, plus audit logging.
- Switch to Postgres (Dev/Prod parity) and add Alembic.
- Add basic Prometheus metrics and worker queue health endpoints.
- Ship annotated one-page clinical summary and a “pilot package” (deployment playbook + data agreement template) for outreach.

## 8) Regulatory & ethical considerations (must-do items)
- Pre-contract: data processing agreements (DPA) and information governance approval with any clinical partner.
- Anonymisation/pseudonymisation: never store identifiable PHI in the dataset for training without explicit approvals.
- Recording decisions and audit trails to support clinical review and regulatory submission.
- Plan for clinical evaluation according to MHRA / UKCA guidance; consider ISO 13485 if venturing into a medical device product.

## 9) How I can help next
- Draft a one-page clinical pilot pack and a short clinician-facing slide deck.
- Draft a sample DPA checklist and a technical deployment playbook.
- Create a minimal branch adding S3 support and a Postgres migration example, or add this private doc into a private branch on request.

---

*This file is saved in the repository at `docs/private/Richard_contacts_and_plan.md`. Note: files committed to the repository are visible to anyone with access to the repo. If you require a truly private file, I can:*

- *Create the file on a new private branch (still visible to repo collaborators),*
- *Encrypt the file with a passphrase and store the encrypted blob in the repo, or*
- *Provide the file to you directly (copy/paste or upload to a private storage location) instead of committing.*

Please tell me if you would like one of the private alternatives; otherwise this markdown file is ready for download from the repository.
