const { exec } = require("child_process"); // execute external command-line scripts as part of the application's workflow.
const fs = require("fs");
const modulesDir = "./src/app/modules";

function extractTrans(module) {
  const i18nExtractScript = `ngx-translate-extract -i ./src/app/${module} -o ./src/app/${module}/i18n/en.json ./src/app/${module}/i18n/ar.json --string-as-default-value --format namespaced-json --marker _`;

  exec(i18nExtractScript, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    console.log(`Extract trans has been executed successfully form ${module}.`);
  });
}

fs.readdir(modulesDir, (err, modules) => {
  if (err) {
    console.error(`Could not list the directory: ${err}`);
    return;
  }

  modules.forEach(module => {
    extractTrans(`modules/${module}`);
  });
});

extractTrans("layout");
extractTrans("shared");
