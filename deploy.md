
### Standalone App

`mvn clean install -P gitRelease`

This does the following commands: 

- `ng build --configuration production --output-path docs --base-href /domain-archetype/`
- renames docs/index.html to docs/404.html (for github pages)
- git add docs folder

