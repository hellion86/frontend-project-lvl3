#Makefile

install:
	npm ci
publish:
	npm publish --dry-run
lint:
	npx eslint .
start:
	npm run serve
test:
	npm test
test-coverage:
	npm test -- --coverage --coverageProvider=v8
