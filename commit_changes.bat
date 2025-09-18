@echo off
echo Adding files to git...
git add README.md TEST_REPORT.md
echo Committing changes...
git commit -m "docs: add screenshots section and deployment instructions

- Add comprehensive screenshots section with application views
- Include deployment instructions for Heroku and Vercel
- Add live application link placeholder
- Complete TDD Kata requirements documentation

Co-authored-by: AI Assistant <ai@github.com>"
echo Pushing to GitHub...
git push origin main
echo Done! All changes committed and pushed.
pause
