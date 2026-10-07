# Git forge connections

Platform administrators connect Avon to the Git hosts courses already use. Those **forge connections** live under LTI **settings** after an institution or system administrator launch. Lecturers never paste tokens; they only see active managed roots configured for their deployment.

## What a connection is

| Concept                          | Meaning                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| **Connection**                   | Avon’s link to one forge path — a GitLab group tree, or a GitHub school organisation. |
| **Allowed group / organisation** | A namespace lecturers may use for coursework.                                         |
| **Enterprise hub** (GitHub)      | A GitHub Enterprise Cloud account in the list; school organisations nest under it.    |

Secrets you enter in settings stay on the server. They are never shown back in
the browser. Each connection belongs to the institution in the administrator
session; one university cannot list or use another university's connections.

Before adding the first connection in a deployed environment, the Avon
operator must configure `FORGE_CREDENTIAL_KMS_KEY_ID` for the
environment-scoped KMS key. Avon uses KMS envelope encryption with institution
and credential-type encryption context; only ciphertext is stored in
PostgreSQL. The database and KMS key form one recovery set.

For local development, leave `FORGE_CREDENTIAL_KMS_KEY_ID` blank and set
`FORGE_CREDENTIAL_ENCRYPTION_KEY` to a persistent base64 32-byte key (generate
one with `openssl rand -base64 32`). This local fallback keeps the API usable
without AWS access and writes v1 envelopes; do not use it as a production
replacement for KMS. Do not put the AES key in the KMS variable: that variable
must be an AWS KMS key ID, alias, or ARN.

## Providers Avon supports today

| Provider                    | Typical university setup                              | How it looks in settings                                    |
| --------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| **GitLab**                  | Self-managed or gitlab.com group hierarchy            | One connection, then hierarchical **allowed groups**        |
| **GitHub Enterprise Cloud** | Enterprise App installed on the university enterprise | Enterprise hub → one connection per **school organisation** |

**GitHub Enterprise Server** (self-hosted GitHub) is not covered by the enterprise App flow in settings yet. Talk to your Avon operator if that is your only forge.

Bitbucket may appear in the provider picker but is not available yet.

## Where to configure

1. Launch Avon as an LTI **administrator** for the deployment.
2. Open **Settings**.
3. **Add connection**:
   - **GitHub** — set up an enterprise App (see [GitHub Enterprise Apps](/integrate/github-enterprise)).
   - **GitLab** — instance URL and access token (see [GitLab groups](/integrate/gitlab-groups)).

The left list scrolls when it grows. Parents can be collapsed or expanded and always show how many children they have (enterprise → organisations; GitLab connection → nested groups).

## Permissions

Use a dedicated provider identity and grant only the access Avon needs:

- **GitLab** — the token needs `read_api` to discover groups. Provisioning,
  subgroup creation, repository writes, and credential validation require the
  `api` scope plus a role permitted to create and manage projects beneath the
  allowed groups. Limit the account’s membership to Avon-managed roots.
- **GitHub Enterprise Cloud** — use the App flow, which requests repository
  administration and contents write, metadata and members read, and pull
  requests write. Enterprise organisation installation permissions are needed
  to list/install school organisations; enterprise organisations write is
  needed only when Avon will create organisations.

Do not use a personal owner account when a dedicated service account or App is
available. Review provider audit logs and rotate credentials through Settings.

## What lecturers get

- Instructors see all **active managed roots in their deployment** during
  coursework setup and can search within those roots. No per-course root
  assignment is required.
- Managed roots remain deployment-scoped; instructors cannot use roots from
  another institution or deployment.
- **Disable** a connection to withdraw it without deleting setup.
- Each coursework stores its own selected root and namespace.

## Instructor namespace selection

During first coursework setup, instructors choose a concrete namespace from the
deployment’s **active managed roots**:

- **GitLab** — browse child groups under a managed root (or use the root itself).
- **GitHub** — select a managed organisation only (no nested orgs).

Disabled connections do not appear. The selection is verified server-side
against the connection layout and stored on the **coursework** (each activity
can use a different root/namespace). Provisioning creates GitLab subgroups under
the selected group, or GitHub repositories directly in the selected organisation
— see [Provisioning repos](/product/provision).

## Migrating a legacy GitLab development setup

Complete this migration before upgrading from an environment-configured
development setup. GitLab environment values are not imported automatically
and are not read by the API runtime.

1. Configure and back up `FORGE_CREDENTIAL_KMS_KEY_ID` and the KMS key policy.
   Retain `FORGE_CREDENTIAL_ENCRYPTION_KEY` only if old v1 envelopes still
   need to be read.
2. Add the existing GitLab host and token as a connection in **Settings** and
   validate it.
3. Allow the group previously named by `GITLAB_ROOT_ID` as a managed root.
4. From an instructor launch, select the location and verify new coursework
   setup and provisioning. Recreate or retire coursework without a managed-root
   reference.
5. Upgrade Avon, remove `GITLAB_ROOT_ID`, and remove the legacy encryption key
   after all old credentials have been rewritten. Retain `GITLAB_BASE_URL` and
   `GITLAB_API_TOKEN` only if smoke/reset tooling still uses them.

If a stored connection is disabled, missing, or cannot be decrypted, Avon
reports the failure instead of silently using smoke credentials.

For the complete environment lifecycle and recovery procedure, see
[Environment variables](/reference/configuration).

## Related reading

- [GitHub Enterprise Apps](/integrate/github-enterprise) — enterprise hubs and school organisations
- [GitLab groups](/integrate/gitlab-groups) — hierarchical allowed groups
- [LTI setup](/integrate/lti) — how administrators reach settings
- [Provisioning repos](/product/provision) — how connections feed student repositories
