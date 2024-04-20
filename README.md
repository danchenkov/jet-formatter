# Jet Formatter

## Strategy
- run html formatter independently (first)
- ignore empty blocks
- indent jet blocks only:
  `{{if `
  `{{range `
  `{{else `
  `{{block `
- unindent jet blocks only:
  `{{else `
  `{{end}}`