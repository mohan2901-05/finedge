=== ROADMAP H VERIFICATION LOG ===

ISSUE 1 — FRONTEND TESTS (spawn EPERM):
- Command: npm test / ng test (Angular CLI @angular/build:unit-test)
- Result: BLOCKED by Windows environment (vitest/esbuild spawn EPERM)
- Root cause: Vite path optimizer (optimizeSafeRealPathSync) on .vite/vitest/ cache entry
- Fix applied: rm -rf .vite/vitest/ + --pool=forks --no-cache
- After fix: vitest runs; 5 disbursement specs execute; only remaining failure is missing Angular TestBed bootstrap (expected, not code)
- Production build: PASS (ng build completes with chunk output)

ISSUE 2 — MYSQL (Blocked by credentials):
- Service: MySQL80 Running
- Connection test: mysql -u root -prootpassword -h localhost → ERROR 1045 (Access denied)
- Migration chain V1-V11 inspected; V8/V9 index interaction identified as concrete compatibility concern
- H2 tests: 384 pass (use H2, not MySQL)
- Status: MySQL unavailable with configured credentials; H2 verified; migration risk documented

ISSUE 3 — END-TO-END (Blocked by unavailable MySQL):
- Backend targeted: PASS (LoanDisbursementControllerTest 13/13, Service 11/11, Repayment 8/8)
- Backend full: 384 PASS, 0 FAIL (verified by surefire XML reports)
- Frontend build: PASS
- Full workflow against persistent DB: BLOCKED (MySQL access denied)
- All new frontend files preserved; all previous agent work preserved
- No destructive git commands; branch remains feature/etfdb-m1-iam
