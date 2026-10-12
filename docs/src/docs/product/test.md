**Testing & feedback** is coursework autograding: students submit or push work, checks run, and results show up for learners and staff in one place - next to the activity, not only in a separate CI tab.

## What it gives you

Lecturers can:

- Run the **same fixtures** the course already trusts (public tests, hidden cases, edge cases).
- See **pass / fail / running** without hunting every student’s pipeline by hand.
- Return feedback early enough that students can still improve before the deadline.

Students get a clear “how did I do?” signal without leaving the course flow.

## For lecturers

**Verify during setup.** In **Coursework → Verify**, upload a sample solution
and tick the files students are expected to change. Avon runs the template
tests against it inside the coursework's Docker image and shows each stage as
it happens. A passing verification completes the step; a failing one shows
which tests failed and why.

**Test students from the Testing page.** The **Testing** item in the sidebar
is organised in tabs:

- **Overview** walks through the three stages (verify, run, review) and lists
  the students who need attention.
- **Students** lets you search, filter, and select students, then run all,
  run the selection, or re-run one repository.
- **Results** shows class averages, the score distribution, and the tests the
  class finds hardest.
- **History** lists every batch of runs.

Open any run to see its overview, each test result, and a timestamped log
with the raw output. Student edits to `tests/` are discarded and flagged, and
changes outside the files you expected are highlighted.

## How tests run

Your Docker image's `CMD` runs the tests with the student's code mounted at
the image `WORKDIR` and no internet access. Write JUnit XML to
`$AVON_RESULTS_DIR` (for example `pytest --junitxml=$AVON_RESULTS_DIR/junit.xml`)
for per-test results; otherwise the exit code decides pass or fail. The test
runner itself is configured by your Avon operator.

## How it fits the activity

- Autograder feedback lives **inside the Avon activity**, alongside the project context.
- Learner and instructor workspaces surface submissions and run status.
- Runs hang off real people and real repos via VLE identity and forge access.

## For students

Follow your lecturer’s instructions for when to submit or push, and where to read feedback. Marks and automated results for the activity show in Avon and, when configured, in the VLE gradebook.

## Related reading

- [Provisioning repos](/product/provision) - the repos tests target
- [Grades & assessment](/product/assess) - when outcomes become marks in the VLE
- [Review suggestions](/product/suggest) - human and assisted feedback next to a submission
