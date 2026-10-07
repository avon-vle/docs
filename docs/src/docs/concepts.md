Use these ideas to understand what happens when someone opens Avon from a course.

## Website vs course activity

Avon shows up in a few different ways:

| Experience           | When you see it                                             |
| -------------------- | ----------------------------------------------------------- |
| Public site and docs | Browsing the product or this documentation                  |
| Course activity      | Opening Avon from a VLE activity (staff or student)         |
| Content selection    | An instructor placing Avon into a course (“Select content”) |

Course windows are simpler than the public site. They fit inside the LMS frame and stay focused on the activity.

## What happens when you launch

1. You click the Avon activity in the VLE.
2. The platform hands Avon a signed launch message.
3. Avon checks that the message is valid for this tool and course.
4. Your browser opens an instructor or learner workspace for that activity.

You do not paste tokens or technical IDs. If someone bookmarks a half-finished launch URL, it may expire - open the activity from the course again.

## How Avon finds the right university

Avon resolves a launch through three durable identities:

- **Institution** - the university or organisation that owns the data.
- **Registration** - one VLE identity, matched by its issuer and client ID.
- **Deployment** - one Avon installation inside that VLE, matched by the deployment ID.

The launch must match all three. This lets one VLE host several universities and
several Avon deployments without routing by a client ID alone. Unknown,
suspended, or ambiguous identities stop before a workspace opens.

## Staff view and student view

Avon uses the role the VLE sends:

- **Instructor workspace** - for teaching staff running the activity.
- **Learner workspace** - for students working on the project.

When you set up a course, use a staff account for **Select content**, and try both staff and student accounts for launches so each view looks right.

## Activities you can place in a course

When you pick content from the VLE, Avon offers a catalog of activity types. Examples include:

- **Team code review** - review-oriented activity for staff framing
- **Graded project checkpoint** - graded activity with a line item when the platform allows it

Each activity opens the matching instructor or learner workspace after launch.

## Where student code lives

Coursework code lives in **private repositories** on your institution’s Git host. Avon works with your forge (GitLab and GitHub are first-class connectors) so launches and workspaces can use real project context.

**Provisioning** creates student or team repos from a single template so every cohort member starts from the same structure. Students then open the right activity from the VLE instead of collecting clone URLs by email.

## Related reading

- [What is Avon](/what-is-avon) - product overview
- [Provisioning repos](/product/provision) - template → student repos
- [Learning platforms](/integrate/lms) - using Avon from the VLE
