
### Standalone App

`mvn clean install -P gitRelease`

This does the following commands: 

- `ng build --configuration production --output-path docs --base-href /questionnaire-viewer/`
- renames docs/index.html to docs/404.html (for github pages)
- git add docs folder

