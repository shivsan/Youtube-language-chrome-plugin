# Research: Minimize Panel Copy

- **Decision**: Keep `Language Companion` as the visible and semantic application heading.
  - **Rationale**: Removes the requested tagline without losing document structure or product identity.
  - **Alternative considered**: Removing all headings from the header; rejected because it weakens accessibility.
- **Decision**: Keep the current-caption section accessible through a region label rather than visible headings.
  - **Rationale**: Preserves screen-reader navigation with no extra visible words.
  - **Alternative considered**: Visually hidden heading; valid, but adds unnecessary markup for a region that can be labelled directly.
- **Decision**: Retain restore error feedback but hide the empty feedback region and omit success copy.
  - **Rationale**: Visible list movement already confirms success, while failures still require explanation.
  - **Alternative considered**: Removing all feedback; rejected because silent failures would be confusing.
