Evidence record (verified via node HTTP client against running localhost:4200 dev server):

1. Request URL tested (borrower component module):
http://localhost:4200/@ng/component?c=src/app/features/borrower/borrower.component.ts@BorrowerComponent&t=1793285393977

2. HTTP status: 200
3. Response headers: content-type: text/javascript, content-length: 0
4. Response body: EMPTY (0 bytes) — not pending until timeout; returned immediately with 200
5. Same request tested for welcome.component.ts: also 200, len=0
6. /borrower route: HTTP 200, len=447 (shell HTML only)
7. /landing route: HTTP 200 (works)
8. /financier route: HTTP 200 (works, empty DB)
9. No errors in response; no hang; server responds promptly with empty JS module
10. Vite/Angular dev-server plugin responsible: module transformation pipeline (node_modules/.vite/ optimization / esbuild plugin for standalone component .ts files) — returns empty module body for component sources
11. Previous fix to borrower.component.ts (ngOnInit + Sub cleanup) preserved; no new edits needed
12. All existing tracked/untracked work preserved (branch feature/etfdb-m1-1am)
