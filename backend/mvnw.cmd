@echo off
setlocal
if exist "C:\Users\mohan\AppData\Local\Programs\apache-maven-3.9.6\bin\mvn.cmd" (
    call "C:\Users\mohan\AppData\Local\Programs\apache-maven-3.9.6\bin\mvn.cmd" %*
) else (
    call "%~dp0.tools\apache-maven-3.9.6\bin\mvn.cmd" %*
)
