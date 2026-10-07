# GitLab groups

GitLab connections use a **group hierarchy**. You connect with a token that can see a root group (or deeper), then **allow** specific groups or subgroups for lecturers.

## Create a connection

1. Settings → **Add connection** → **GitLab**.
2. **Routing ID** — a stable label for this connection (for example `computer-science-gitlab`).
3. **Base URL** — your GitLab instance (for example `https://gitlab.com` or your self-managed host).
4. **Access token** — a token that can see the groups you intend to manage.
5. **Create and validate** — Avon checks the token and remembers the home group when it can.

After save, the token is not shown again. Use **Rotate credentials** when you need a new token.

### Token permissions

Prefer a dedicated service account restricted to the groups Avon manages.
`read_api` is sufficient only for discovery. Avon’s provisioning workflows
create groups/projects and write repository content, so the token needs the
GitLab `api` scope and the account needs an appropriate role in each allowed
root. Do not grant instance-wide administrator access when group membership is
sufficient.

## Allowed groups for lecturers

On an active connection you can:

1. **Allow the token’s home group** — the group the token resolves to.
2. **Find subgroup** — search by name or path, then allow.
3. **Create subgroup** under a parent (when the token can create groups), then allow it in one step.

After allowing a group as a managed root, instructors can select it (or a
descendant) during coursework setup for any course on that deployment.

### Hierarchical display

Paths appear as a tree, not a flat list:

```
Connection (university)
├── cs                 ← structure only if not itself allowed
│   └── cs101          ← allowed
└── maths
    └── m101           ← allowed
```

- You can allow only a **deep** group (for example under `cs/cs101`). Intermediate folders still show so the hierarchy stays readable.
- Folders that are **not** allowed look muted (**structure only**) — lecturers cannot use them until you allow them.
- The left connections list nests the same tree under the GitLab connection. **Allowed for lecturers** uses the same hierarchy, with **Remove** only on groups that are actually allowed.

## Connection actions

| Action             | Effect                                                              |
| ------------------ | ------------------------------------------------------------------- |
| Validate           | Re-check the stored token against GitLab                            |
| Rotate credentials | Replace the token                                                   |
| Disable / Enable   | Withdraw or restore the connection for courses                      |
| Remove             | Deletes the connection when no course still uses its allowed groups |

## Tips

- Prefer a dedicated service account token with only the access your policy needs.
- Very large group trees may not list every group at once — search by path for deep groups.
- If validate fails on self-managed GitLab, confirm the base URL and that the token can reach the instance.

## Related reading

- [Git forge connections](/integrate/forge)
- [GitHub Enterprise Apps](/integrate/github-enterprise)
