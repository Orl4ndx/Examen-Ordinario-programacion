@ECHO off
GOTO start
:find_dp0
SET dp0=%~dp0
EXIT /b
:start
SETLOCAL
CALL :find_dp0

IF EXIST "%dp0%\/bin/sh.exe" (
  SET "_prog=%dp0%\/bin/sh.exe"
) ELSE (
  SET "_prog=/bin/sh"
  SET PATHEXT=%PATHEXT:;.JS;=;%
)

endLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "%_prog%"  "%dp0%\..\react-native-vector-icons\bin\fa5-upgrade.sh" %*
