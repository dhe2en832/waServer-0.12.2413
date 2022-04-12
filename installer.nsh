!define checkInstOldGUIDFormat "!insertmacro checkInstOldGUIDFormat"
!macro checkInstOldGUIDFormat
	; check whether there is a user installation with the old GUID format in registry, abort if found
	ReadRegStr $0 HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "QuietUninstallString"
	StrCmp $0 "" 0 askForUninstall
	; check whether there is an admin installation with the old GUID format in registry, abort if found
	ReadRegStr $0 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "QuietUninstallString"
	StrCmp $0 "" proceed askForUninstall
	askForUninstall:
		; display info message and abort
		MessageBox MB_OK|MB_ICONEXCLAMATION "Aplikasi wacsa sudah ter-install, mohon uninstall terlebih dahulu.$\r$\nPastikan data log sudah di-backup ke lokasi lain.$\r$\n$\r$\n$\r$\nCSA Computer - 2022"
		Abort
	proceed:
!macroend

!macro customInit
    ; check whether there is an existing installation with the old GUID in registry
    ${ifnot} ${isUpdated}
  	  ${checkInstOldGUIDFormat}
	  StrCpy $INSTDIR "C:\wacsa"
    ${endif}
!macroend

!macro customUnInit
    ${if} ${isUpdated}		
	  	CreateDirectory "$LOCALAPPDATA\wacsa"
  	  	CopyFiles /SILENT "$INSTDIR\wacsa.ini" "$LOCALAPPDATA\wacsa"
	  	CopyFiles /SILENT "$INSTDIR\backup" "$LOCALAPPDATA\wacsa"
	  	CopyFiles /SILENT "$INSTDIR\wacsa-sent.json" "$LOCALAPPDATA\wacsa"
	  	CopyFiles /SILENT "$INSTDIR\wacsa-received.json" "$LOCALAPPDATA\wacsa"
		CopyFiles /SILENT "$INSTDIR\wacsa-statistic.json" "$LOCALAPPDATA\wacsa"
		CopyFiles /SILENT "$INSTDIR\wacsa-error.log" "$LOCALAPPDATA\wacsa"
		CopyFiles /SILENT "$INSTDIR\session" "$LOCALAPPDATA\wacsa"
    ${endif}
!macroend

!macro customInstall
    ${if} ${isUpdated}
		IfFileExists "$LOCALAPPDATA\wacsa\*.*" 0 cancelCopy
			RMDir /r "$INSTDIR\backup"
			Delete "$INSTDIR\wacsa.ini"
			CopyFiles /SILENT "$LOCALAPPDATA\wacsa\wacsa.ini" "$INSTDIR"
	  		CopyFiles /SILENT "$LOCALAPPDATA\wacsa\backup" "$INSTDIR"
	  		CopyFiles /SILENT "$LOCALAPPDATA\wacsa\wacsa-sent.json" "$INSTDIR"
	  		CopyFiles /SILENT "$LOCALAPPDATA\wacsa\wacsa-received.json" "$INSTDIR"
			CopyFiles /SILENT "$LOCALAPPDATA\wacsa\wacsa-statistic.json" "$INSTDIR"
			CopyFiles /SILENT "$LOCALAPPDATA\wacsa\wacsa-error.log" "$INSTDIR"
			CopyFiles /SILENT "$LOCALAPPDATA\wacsa\session" "$INSTDIR"
			RMDir /r "$LOCALAPPDATA\wacsa"
		cancelCopy:
    ${endif}
!macroend