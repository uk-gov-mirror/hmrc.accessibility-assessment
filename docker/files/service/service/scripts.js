const util = require('util');
const exec = util.promisify(require('child_process').exec)
const logger = require('../logger')
const { applicationStatus } = require('./status');

async function runScript(command) {
  const { stdout, stderr } = await exec(command)
  if(stderr) {
    logger.log("ERROR", `Command \'${command}\' ran with the following errors: ${stderr}`);
    applicationStatus('PAGE_ASSESSMENT_FAILED')
    return
  }
}

module.exports.runAssessment = async () => {
  await runScript('cd /home/seluser && ./run_assessment.sh');
  await runScript('cd /home/seluser && ./generate_report.sh');
  applicationStatus('REPORT_READY');
}
