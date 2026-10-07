**Provisioning** is the lecturer-facing job: start from one coursework template and create the private repositories every student or team needs - without hand-building dozens of Git projects.

## Why it matters

For a coding module you usually want:

- The same starter structure for every student or team
- Private repos (not a shared public fork free-for-all)
- Layout that matches how you will autograde and review
- Students reaching the right place from the VLE, not from a long email of clone URLs

Avon’s provision flow is built around that.

## Course flow

1. Choose or prepare **starter code** (the template repository).
2. Bring in the **roster** (and teams, where you use them).
3. Create **private repos** on the course Git host with a consistent layout.
4. Place **Avon activities** in the VLE so students open the right workspace from the course page.

When a student opens the activity before their repository exists, Avon shows a
provisioning message alongside their workspace. They can use **Check
repository** after the lecturer finishes provisioning. Once their individual or
team repository is ready, the student workspace links directly to the private
repository on the configured Git forge.

The student workspace reads its branch list and commit history from that
repository. Until the assessment runner is connected, commits show that no runs
have completed and expose the test-run action without inventing scores or
results.

## Student repository guide

Avon adds a branded `README.md` and logo to the coursework template before
student or team repositories are created. The guide includes the coursework
title, deadline, maximum marks, links to `code/` and `tests/`, and concise
instructions for working, submitting, and finding help through the VLE.

The root `README.md` and `.avon/logo.svg` are managed by Avon when instructors
upload or update template files. Coursework starter files remain inside
`code/`, with assessment tests inside `tests/`.

## Working with your forge

- Platform admins connect Avon to **GitLab** or **GitHub** under settings ([Git forge connections](/integrate/forge)).
- **GitHub Enterprise Cloud** uses enterprise Apps and one school org per connection ([GitHub Enterprise Apps](/integrate/github-enterprise)).
- **GitLab** uses hierarchical allowed groups ([GitLab groups](/integrate/gitlab-groups)).
- Students and staff open the activity from the **VLE**; repo access follows your forge and course setup.

## Where resources are created

Each coursework activity chooses its own forge location during instructor setup.
The choice does not bind the LMS course, so other coursework activities in the
same course can use a different group or organisation:

- **GitLab** — a year-coded coursework subgroup such as `2526-data-structures`
  is created under the selected group. Its template project is named `template`;
  student repositories use the learner ID (for example `ab1234`).
- **GitHub** — repositories are created directly in the selected organisation, using collision-safe names (no nested orgs). The template is named like `2627-coursework`; student repos are `2627-coursework-ab1234`.

Choose **Standard** or **Resit** during first-time setup, not at provision time.
A resit is its own activity so repositories do not overlap: the year marker
becomes `2627R` (for example `2627R-coursework`). GitHub student repos follow
that path (`2627R-coursework-ab1234`). GitLab still uses the learner ID for
student projects; the resit subgroup keeps them separate.

On the provision step, lecturers provision **all remaining students** or
**select** specific ones. Students who already have a repository are left in
place.

Confirming **Create workspace** creates the initialized private template
repository immediately. GitHub requests use the selected connection's current
App installation credentials, so lecturers do not need to configure a separate
token for coursework setup.

Recovery checks that stored resources still belong under the location saved for
that coursework (for GitLab, ancestry under the selected group).

## Related reading

- [How Avon works](/concepts) - launch, roles, and where code sits
- [Git forge connections](/integrate/forge) - admin connection model
- [Testing & feedback](/product/test) - how those repos feed automated checks
- [Learning platforms](/integrate/lms) - placing the activity in the VLE
