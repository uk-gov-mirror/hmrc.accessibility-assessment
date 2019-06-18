
# page-capture-spike

This is a placeholder README.md for a new repository


## Server
### Start the server
Start the service from the `./server` directory with:
```bash
node server.js
```
The server will start on port 6001.

### Retrieve unique pages
Once a test run has been completed, and all of  the pages that you'd like to assess have been saved in the `./output` directory, execute the `identifyUniqueOutputFoldersByUrl.sh` script. Ensure that you change the `serverName` and `uniquePageDirectory` parameters.

You will also need to make sure that the output generated by the service is copied into the `service.log` file.  This output is required in order to sort and filter for unique URLs.

## Page Assessment
To assess all of the pages in a given folder (for example `./trusts-unique-pages`) execute `./assessAllPages.sh trusts-unique-pages` and all folders with names beginning with `1560` (timestamp) will have their `index.html` file assessed by axe, nu html validator and pa11y, and have reports generated in that same folder.

### Test suites

Find 10 test suites that meet the following requirement:
 - use chrome
 - run sm profile
 - run for less than 20 minutes in build
 - are currently passing
 - have an sm profile of < 30 services


Candidate test runs:
Tested framework with trusts-ui-tests

Further test suites:
1. agent-onboarding-ui-tests - first attempt failed....
2. business-multi-factor-authentication-acceptance-tests  DONE
3. passcode-acceptance-tests   DONE
4. personal-details-validation-acceptance-tests (33)  DONE
5. business-tax-account-acceptance-tests (35) DONE
6. add-taxes-acceptance-tests
7. business-rates-challenge-ui-tests (30)
8. cest-ui-sub-optimised-tests
9. common-transit-convention-ui-acceptance-tests
10. fset-faststream-admin-acceptance-tests

## Visualising a11y alerts
We will build a tool which generates a json file which can be bulk uploaded to an elastic search instance.

### Test setup of ELS and Kibana
To start ElasticSearch and Kibana, ensure you have docker-compose installed, then run `docker-compose up -d` from the `visualisation/` directory.

To bulk load data using the json schema detailed below, run `./load-data.sh`

In the Kibana UI, go to **Management -> Saved Objects** and click **Import**.  Select the `visualistation/kibana-saved-objects.json` file to import some basic dashboards.

### Accessibility Alert json schema
The each violation found will be stored as the below json object:
```json
{
    "tool": "String",
    "test_suite": "String",
    "test_run": "String",
    "path": "String",
    "timestamp": INT,
    "code": "String",
    "severity": "String",
    "description": "String",
    "selector": "String",
    "snippet": "String"
}
```
**tool**: the tool the violation was found with.  i.e. aXe, vnu or pa11y
**test_suite**: the test suite executed.  i.e. trusts-ui-test
**test_run**: lowest timestamp/folder value generated during the test, converted to the date format 'yyyy-MM-dd_HH:mm:ss'
**path**: the path part of the url stored in each page directory's `data` file.  i.e. `/trusts-registration/trust-registered-online`
**timestamp**: the timestamp integer used to name the directory

The following fields will be taken from the json reports generated by each tool:
**code**:
- pa11y -> code
- vnu -> there is no unique code for the issues raised. (!)
- aXe -> node.any[].id

**severity**:
- pa11y -> type
- vnu -> type
- aXe -> node.any[].impact

**description**:
- pa11y -> message
- vnu -> message
- aXe -> node.any[].message

**selector**:
- pa11y -> selector
- vnu -> there is no selector given in the vnu report (!)
- aXe -> node.any[].data{}

**snippet**:
- pa11y -> context
- vnu -> extract
- aXe -> nodes[].html


*Note:  In axe, capture only violations and incomplete scans, prefix incomplete scans with INCOMPLETE*

### Alert searches and dashboards

Alert type count across test test_suite
Alert type count across all test suites.
see ELS analytics: https://www.elastic.co/guide/en/elasticsearch/guide/current/_analytics.html

#### global dashboard
Bar chart of alert count for each alert type per tool.  Stack test suites.

Pie chart, total alerts by tool (aXe, vnu, pa11y)


#### Test Suite Dashboard
Test suite dashboards could be driven by test run using controls:  https://www.elastic.co/guide/en/kibana/current/add-input-controls.html


Bar chart for a given test suite.  Y-axis of alert count, stacked by alert type.  X-axis of tool (aXe, VNU, pa11y)
https://www.elastic.co/guide/en/kibana/current/createvis.html end of page....

Pie chart of total alerts by tool for a given test suite.

Table showing unique alerts by count.  Include type, tool, count

Table showing path, alert count.

Heat map of alert types?

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
