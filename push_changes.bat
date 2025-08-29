@echo off
echo Pushing Angular project changes to repository...
echo.

echo Checking git status...
git status
echo.

echo Adding all changes...
git add .
echo.

echo Committing changes...
git commit -m "Add halal-friendly content filtering system

- Implement ContentFilterService for family-friendly movie filtering
- Block Romance movies for halal compliance (genre ID 10749)
- Block Horror movies and explicit adult content
- Load 6 pages instead of 2 to ensure enough content after filtering
- Remove search clear button as requested
- Update trendify component with comprehensive filtering
- Update movie-details component with filtered recommendations
- Ensure all displayed content is appropriate and halal-friendly"
echo.

echo Pushing to repository...
git push origin main
echo.

echo If 'main' branch doesn't exist, trying 'master'...
git push origin master
echo.

echo Push completed!
pause
