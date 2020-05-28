const fs = require('fs');
const process = require('process');

function writeEnvAndGlobals() {
  const apigeeEnv = process.env.APIGEE_ENVIRONMENT;
  const serviceBaseUrl = process.env.SERVICE_BASE_PATH;
  const apikey = process.env.API_KEY;
  const baseUrl = `https://${apigeeEnv}.api.service.nhs.uk/${serviceBaseUrl}`

  writeGlobals(apikey);
  writeEnvVariables(baseUrl, apigeeEnv)
}

function writeGlobals(xApiKey) {
  fs.copyFileSync("e2e/local.globals.json", "e2e/deploy.globals.json");

  let globals = JSON.parse(fs.readFileSync("e2e/deploy.globals.json"));

  const apikeyGlobal = {
    "key": "X-API-Key",
    "value": xApiKey,
    "enabled": true
  };

  for(let i = 0; i < globals.values.length; i++) {
    if (globals.values[i].key === "X-API-Key") {
      globals.values[i] = apikeyGlobal;
    }
  }

  fs.writeFileSync('e2e/deploy.globals.json', JSON.stringify(globals));
}

function writeEnvVariables(baseUrl, apigeeEnv){
  let envVariables = JSON.parse(fs.readFileSync(`e2e/environments/${apigeeEnv}.postman.json`));
  const baseUrlObj = {
    "key": "base_url",
    "value": baseUrl,
    "enabled": true
  };
  if (envVariables.values[0].key === "base_url") {
    envVariables.values[0] = baseUrlObj;
  }
  fs.writeFileSync(`e2e/environments/deploy.${apigeeEnv}.postman.json`, JSON.stringify(envVariables));
}

function main() {
  writeEnvAndGlobals();
}

main()
