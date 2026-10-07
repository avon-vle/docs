Avon connects to virtual learning environments through **LTI 1.3**. You do not install a different Avon plugin for every LMS brand; you register Avon as an external tool the platform already understands.

## Which platforms can use Avon

Common university platforms (Moodle, Canvas, Blackboard, Brightspace, and others) work when they support LTI 1.3 tool registration.

**Any LTI 1.3 platform** that can register an external tool (login, launch, keys) can use Avon once configured. If you need marks returned to the gradebook, confirm the platform supports LTI grade services for external tools.

## What staff do in the VLE

Exact labels differ by platform. The pattern is the same:

1. A platform administrator registers Avon as an **LTI 1.3 external tool** using the tool URLs and key set, then submits the platform details through the Avon setup link. See [LTI setup](/integrate/lti).
2. In a course, add an external tool / LTI activity.
3. Prefer **content selection** (“Select content” / deep linking) when the platform offers it, so Avon can place a structured activity.
4. Students and staff **launch** from the course page. They do not need a separate Avon password for that path.

## What students experience

- Find the Avon activity like any other course item.
- Launch it from the VLE; land in a student workspace for that activity.
- Work with the repo, submit, feedback, and grades your lecturer has set up for the activity.

Students do not need to understand LTI, tokens, or tool registration.

## Grades and class lists

When the platform supports it, Avon can:

- Work with **grade line items** for graded activities
- Use **names and roles** services for roster-style information

Graded content carries line-item metadata when the platform accepts it during content selection.

## Before go-live

- Register the tool in a **test course** first.
- Launch as **staff** and as **student**.
- Confirm content selection returns an activity you can open again later.
- If you need grade passback, confirm that with a sample graded item before the live module.
- Connect your **Git forge** so provisioned coursework has somewhere to live — see [Git forge connections](/integrate/forge).

## Related reading

- [LTI setup](/integrate/lti) - registration details and launch behaviour
- [Grades & assessment](/product/assess) - marks and line items
- [How Avon works](/concepts) - staff vs student views
