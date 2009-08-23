#!/bin/sh
osascript<<END
tell application "System Events"
   return count of (every process whose name is "GrowlHelperApp")
end tell
END
