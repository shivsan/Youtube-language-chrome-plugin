# UX Requirements Checklist: Translation Record Control

**Purpose**: Validate the quality, completeness, and consistency of requirements for the compact translation control
**Created**: 2026-10-25
**Feature**: [spec.md](../spec.md)

## Visual State Requirements

- [x] CHK001 Are active and paused icon requirements distinct without relying only on colour? [Clarity, Spec §FR-002, §FR-003, §FR-010]
- [x] CHK002 Is the fixed-size/no-layout-shift requirement measurable in both states? [Measurability, Spec §FR-011, §SC-005]
- [x] CHK003 Are the status label and translation-area messages defined for the paused state? [Completeness, Contract §Paused mode]

## Interaction Requirements

- [x] CHK004 Is the result of pressing the control defined from both active and paused states? [Completeness, Spec §FR-005, §FR-007]
- [x] CHK005 Are pending, debounced, and newly triggered automatic translations covered while paused? [Edge case, Spec §FR-005, §SC-003]
- [x] CHK006 Is behavior under rapid repeated presses specified? [Edge case, Spec §Edge Cases]
- [x] CHK007 Is changing a language while paused specified? [Coverage, Spec §FR-008]

## Continuity and Persistence Requirements

- [x] CHK008 Is the scope and lifetime of the paused state explicit? [Clarity, Spec §FR-009]
- [x] CHK009 Are unaffected features named so pausing does not accidentally stop learning workflows? [Scope, Spec §FR-006]
- [x] CHK010 Is resume behavior for the currently selected caption explicit? [Clarity, Spec §FR-007]

## Accessibility Requirements

- [x] CHK011 Are keyboard operation and visible focus requirements stated? [Accessibility, Spec §FR-010]
- [x] CHK012 Are accessible names and tooltips defined as next-action labels in both states? [Accessibility, Spec §FR-004]

## Evidence and Boundaries

- [x] CHK013 Can every success criterion be verified by an automated test, extension validation, or the documented Canary scenario? [Traceability, Plan §Constitution Check]
- [x] CHK014 Does the plan explicitly avoid new permissions, remote services, and persistent caption data? [Privacy, Plan §Security, Privacy, and Migration Impact]

## Notes

- Review complete: all requirements are specific, traceable, and internally consistent.
