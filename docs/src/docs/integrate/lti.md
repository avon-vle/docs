Lecturers mostly meet LTI as “external tool” activities in the VLE. This page is for **platform admins and technical course support** who register Avon and need to know what happens on launch and content selection.

## What you are registering

Avon is an **LTI 1.3 tool**. The learning platform:

1. Starts a secure login with Avon.
2. Sends a signed launch (or deep-link) message.
3. Opens the activity for the user in the browser.

Avon checks every launch server-side before opening a staff or student workspace. Users never need to paste tokens.

## Dynamic registration (recommended)

The Avon operator generates a seven-day, single-use registration link for the
university and sends it to the VLE administrator. The administrator pastes the
link into the VLE’s LTI dynamic-registration field. The VLE appends
`openid_configuration` and `registration_token`; Avon then fetches the VLE
metadata, registers its LTI configuration, and stores the returned client ID
and platform endpoints.

Dynamic registration is available in the following administrator areas:

| VLE              | Where to start                                |
| ---------------- | --------------------------------------------- |
| Moodle           | Add LTI Advantage / dynamic tool registration |
| Canvas           | Developer Keys / LTI registration             |
| Brightspace      | Manage Extensibility                          |
| Blackboard Learn | Anthology Developer Portal                    |

The exact labels vary by version and hosting plan. The VLE administrator should
choose its standard LTI 1.3 dynamic-registration option and paste the Avon
link, not the Avon launch URL.

On success Avon sends the standard `org.imsglobal.lti.close` browser message so
the VLE can close or refresh its registration window. The VLE’s
`registration_token` is used only for the exchange and is not stored by Avon.

Local development accepts HTTP only when Avon itself uses a local HTTP tool
URL; hosted registrations must use HTTPS. If a Moodle launch logs an NRPS
access-token `404`, check that the stored VLE token endpoint is reachable from
the API and matches the Moodle issuer’s `/mod/lti/token.php` path. Forge
connections do not control roster access.

If the VLE does not support dynamic registration, use the manual setup below.

## Manual setup

Use the one-time setup link and choose the manual path. Register the external
tool using this origin:

**`{{LTI_TOOL_BASE_URL}}`**

| Field                 | URL                                                                          |
| --------------------- | ---------------------------------------------------------------------------- |
| Tool URL              | `{{LTI_TOOL_BASE_URL}}/lti/launch`                                           |
| Initiate login URL    | `{{LTI_TOOL_BASE_URL}}/lti/login`                                            |
| Public keyset URL     | `{{LTI_TOOL_BASE_URL}}/lti/jwks.json`                                        |
| Redirection URI(s)    | `{{LTI_TOOL_BASE_URL}}/lti/launch` and `{{LTI_TOOL_BASE_URL}}/lti/deep-link` |
| Content selection URL | `{{LTI_TOOL_BASE_URL}}/lti/deep-link`                                        |

Then return the VLE’s:

- **Issuer** - the VLE identity URL
- **Client ID** - the ID assigned to Avon’s registration
- **Deployment ID** - the ID for the deployed Avon installation
- Authorization, token, and JWKS endpoints

The client ID and deployment ID are different values. Avon uses the issuer and
client ID to identify the platform registration, then requires the deployment
ID to route each launch to the correct university. Avon never invents either
value and does not route by client ID alone.

Some VLEs return a client ID without a deployment ID during dynamic
registration. Avon saves that registration and shows **Finish setup** in
Manage so an operator can add the deployment ID when the VLE creates it.

After a successful launch, staff and students continue in the browser on the Avon web app for this deployment (instructor or learner workspace).

## Resource launch (opening an activity)

1. The user clicks the Avon activity in the course.
2. The platform sends a launch to Avon.
3. Avon validates it, then opens a session in the browser.
4. Staff see the **instructor** workspace; students see the **learner** workspace.

If a launch URL is bookmarked mid-flow, it may expire. Opening from the course again is the right recovery.

## Content selection (placing an activity)

1. In the VLE, choose **Select content** (or equivalent) for the Avon tool.
2. Avon shows a **catalog** of activity types the platform allows.
3. You pick one; the platform stores it as a course activity.
4. Later launches open that activity for staff and students.

### Examples in the catalog

- **Team code review** - review-oriented framing for staff
- **Graded project checkpoint** - graded; includes line-item details when the platform allows

## Security

- Launch messages are checked **before** anyone gets a workspace.
- Browser sessions for a launch are short-lived and meant to be used from that handoff.
- Platform security tokens are not meant to appear in everyday web URLs.
- Avon publishes a **JWKS** key set for the platform to verify tool messages.

## Grades

When the platform supports **Assignment and Grade Services**, graded catalog items carry line-item metadata at placement time, and scores can return to the VLE gradebook. See [Grades & assessment](/product/assess).

## Related reading

- [Learning platforms](/integrate/lms) - staff and student workflow in the VLE
- [How Avon works](/concepts) - launches, roles, and activities
- [What is Avon](/what-is-avon) - product overview
