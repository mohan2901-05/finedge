@echo off
setlocal
rem FinEdge local default: when the requested goals include spring-boot:run,
rem activate the etfdb MySQL profile for the forked app via environment
rem (profile *values* live in application-etfdb.yml; nothing is hardcoded
rem here). Other goals such as `test` are untouched and keep the default H2
rem setup. Explicit callers can still override with SPRING_PROFILES_ACTIVE.
if "%SPRING_PROFILES_ACTIVE%"=="" (
    echo %* | findstr /C:"spring-boot:run" >nul && set SPRING_PROFILES_ACTIVE=etfdb
)
if exist "C:\Users\mohan\AppData\Local\Programs\apache-maven-3.9.6\bin\mvn.cmd" (
    call "C:\Users\mohan\AppData\Local\Programs\apache-maven-3.9.6\bin\mvn.cmd" %*
) else (
    call "%~dp0.tools\apache-maven-3.9.6\bin\mvn.cmd" %*
)
