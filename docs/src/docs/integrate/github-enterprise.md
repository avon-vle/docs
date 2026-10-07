# GitHub Enterprise Apps

For universities on **GitHub.com Enterprise Cloud**, Avon uses an **enterprise-owned GitHub App**. Each enterprise is a hub in forge settings; each **school organisation** (for example CS or Maths) becomes its own connection under that hub.

This page is for the **settings** flow on GitHub.com Enterprise Cloud — not self-hosted GitHub Enterprise Server.

## How it fits together

```
Enterprise hub
├── School org: cs-dept     → connection (on or off for courses)
├── School org: maths-dept → connection
└── …
```

- GitHub does not nest organisations under organisations. In Avon the hierarchy is **enterprise → school organisations**.
- Lecturers attach coursework to a **school organisation**, not to the enterprise account itself.
- You can add **more than one enterprise** (for example multi-campus). Each has its own App and its own list of school organisations.

## Set up an enterprise

1. **Add connection** → choose **GitHub**.
2. Enter the **enterprise** handle (without `@`).
3. **Create App on GitHub** — opens enterprise App registration with a sensible Avon-oriented name and permissions.
4. **Install on enterprise** — install the App on the enterprise account (not only a personal user).
5. Enter **App ID** and **Client ID**, and upload the **private key** file (`.pem`).
6. **Save** — Avon checks the enterprise install and lists the hub in Connections.

The list shows the **enterprise display name** when GitHub provides one, not only the App bot name.

The generated App registration requests repository administration and contents
write, metadata and members read, and pull requests write. It also requests
enterprise installation management so Avon can attach the App to school
organisations. Enterprise organisation write is needed only when Avon will
create organisations; if your policy forbids that, do not use the create
organisation action.

### If something fails

- Confirm the App is **installed on the enterprise**, with permission to install onto organisations (and to create organisations if you need that).
- Use **Refresh** after fixing permissions on GitHub.
- Some **enterprise trials** block creating organisations even when permissions look correct.

## Allow school organisations

Select the **enterprise** in the connections list:

1. Search organisations in the enterprise.
2. **Allow** — installs the App on that organisation if needed and adds it as a connection under the hub.
3. Optionally **Create organisation** (login, profile name, billing email, and a first admin’s GitHub username).

Allowed organisations appear **indented under the enterprise**. The enterprise row always shows how many organisations sit under it, including when the list is collapsed.

Select a school organisation to turn it **on or off** for courses. That connection _is_ the organisation.

## Remove an enterprise

**Remove** on the enterprise panel drops Avon’s stored App for that enterprise. Existing school organisation connections stay; you cannot allow **new** organisations for that enterprise until the App is added again.

## Checklist

| Check                               | Why                                                    |
| ----------------------------------- | ------------------------------------------------------ |
| Enterprise-owned App                | Needed for enterprise-level install and org management |
| App installed on the **enterprise** | Allow / create organisation steps fail otherwise       |
| One organisation per school or unit | Matches how courses attach to GitHub                   |

## Related reading

- [Git forge connections](/integrate/forge) — overview
- [GitLab groups](/integrate/gitlab-groups) — hierarchical groups on GitLab
