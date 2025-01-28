# Libernetix example service


openapi-generator-cli generate -i https://gate.libernetix.com/api/schema/v1/ -g typescript-fetch -o ./src/modules/libernetix-connector/openapi --skip-validate-spec --additional-properties=generateApis=false,supportsES6=true


npx openapi-typescript https://gate.libernetix.com/api/schema/v1/ --output ./src/modules/libernetix-connector/openapi/index.ts

openapi-generator-cli generate \
-i https://gate.libernetix.com/api/schema/v1/ \
-g typescript-fetch \
-o ./src/modules/libernetix-connector/openapi \
--skip-validate-spec \
--additional-properties=generateApis=false,supportsES6=true,defaultOptional=true
