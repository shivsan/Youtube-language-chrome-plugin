# UX Requirements Quality Checklist: Click Original Words to Learn

**Purpose**: Reviewer checklist for interaction, feedback, and accessibility requirement quality
**Created**: 2026-10-25
**Ownership**: Reviewer-owned. An unchecked item does not indicate unfinished implementation.

## Interaction Clarity

- [ ] CHK001 Are the selectable token boundaries and preserved punctuation behavior explicitly defined? [Clarity, Spec §FR-001–FR-002]
- [ ] CHK002 Are the available, saved, and known interaction outcomes distinct and non-conflicting? [Consistency, Spec §FR-006–FR-008]
- [ ] CHK003 Is manual selection below the learner threshold explicitly separated from automatic collection? [Clarity, Spec §FR-005]

## Feedback and Accessibility

- [ ] CHK004 Are keyboard and assistive-technology requirements specified for every selectable word? [Coverage, Spec §FR-001, FR-008]
- [ ] CHK005 Is feedback timing, announcement behavior, and layout stability measurable? [Measurability, Spec §FR-009, SC-004–SC-005]
- [ ] CHK006 Is non-German fallback behavior explicitly bounded? [Edge Case, Spec §FR-011]

## Data Honesty

- [ ] CHK007 Does the specification forbid invented levels and meanings for unlisted words? [Consistency, Spec §FR-004]
- [ ] CHK008 Are deduplication, known-word protection, and vocabulary-limit interactions covered? [Completeness, Spec §FR-006–FR-007, Edge Cases]

## Notes

- Reviewers mark items complete when the written requirements are judged sufficiently clear.
