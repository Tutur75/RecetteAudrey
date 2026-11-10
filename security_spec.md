# Security Specification: Carnet de Recettes d'Audrey

## 1. Data Invariants
- Recipes must have a title (<= 150 characters), a valid season ('spring', 'summer', 'autumn', 'winter'), positive prepTime, non-empty ingredients and instructions arrays.
- Notes must be capped at 2000 characters.
- Images must not exceed safe payload boundaries (< 300,000 characters).
- Tags must be bounded array (<= 15 items).
- Meal plans must have weekIndex (1 or 2) and structured days object.

## 2. Dirty Dozen Test Scenarios
1. Injecting 500KB arbitrary script into recipe title -> DENIED (max length 150).
2. Inserting invalid season (e.g. 'nuclear_winter') -> DENIED (enum validation).
3. Negative prep time (-50 mins) -> DENIED.
4. Omission of required fields (missing instructions) -> DENIED.
5. Overlarge tags list (> 50 tags) -> DENIED (size limit).
6. Non-string notes or notes exceeding 2000 chars -> DENIED.
7. Attempting to write unwhitelisted root collections -> DENIED.
8. Injecting invalid document ID with malicious characters -> DENIED.
9. Malformed meal plan with invalid weekIndex -> DENIED.
10. Unstructured meal plan days mapping -> DENIED.
11. Attempting to override system timestamps -> DENIED.
12. Attempting unbounded array injections -> DENIED.
