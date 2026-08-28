/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8216145833333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.96875, 500, 1500, "POST /view (view product)"], "isController": false}, {"data": [0.59375, 500, 1500, "POST addtocart (item 18)"], "isController": false}, {"data": [0.9375, 500, 1500, "POST addtocart (item 19)"], "isController": false}, {"data": [0.96875, 500, 1500, "POST addtocart (item 16)"], "isController": false}, {"data": [1.0, 500, 1500, "POST addtocart (item 17)"], "isController": false}, {"data": [0.75, 500, 1500, "POST addtocart (item 1)"], "isController": false}, {"data": [0.5625, 500, 1500, "POST addtocart (item 14)"], "isController": false}, {"data": [0.5625, 500, 1500, "POST addtocart (item 2)"], "isController": false}, {"data": [0.9375, 500, 1500, "POST addtocart (item 15)"], "isController": false}, {"data": [1.0, 500, 1500, "POST addtocart (item 12)"], "isController": false}, {"data": [0.84375, 500, 1500, "POST /login"], "isController": false}, {"data": [1.0, 500, 1500, "POST addtocart (item 13)"], "isController": false}, {"data": [0.96875, 500, 1500, "POST addtocart (item 5)"], "isController": false}, {"data": [0.59375, 500, 1500, "POST addtocart (item 10)"], "isController": false}, {"data": [0.5625, 500, 1500, "POST addtocart (item 6)"], "isController": false}, {"data": [0.90625, 500, 1500, "POST addtocart (item 11)"], "isController": false}, {"data": [0.9375, 500, 1500, "POST addtocart (item 3)"], "isController": false}, {"data": [1.0, 500, 1500, "POST addtocart (item 4)"], "isController": false}, {"data": [0.96875, 500, 1500, "POST addtocart (item 20)"], "isController": false}, {"data": [1.0, 500, 1500, "POST addtocart (item 9)"], "isController": false}, {"data": [0.9375, 500, 1500, "POST addtocart (item 7)"], "isController": false}, {"data": [0.53125, 500, 1500, "GET /entries (browse products)"], "isController": false}, {"data": [0.9375, 500, 1500, "POST addtocart (item 8)"], "isController": false}, {"data": [0.25, 500, 1500, "POST /viewcart"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 384, 0, 0.0, 478.55729166666663, 261, 4716, 309.0, 728.0, 1207.0, 2283.699999999996, 0.5025664919026592, 1.9627004703708262, 0.10740963087210992], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /view (view product)", 16, 0, 0.0, 347.6875, 283, 608, 314.5, 495.3000000000001, 608.0, 608.0, 0.04024266325945451, 0.019413941064619654, 0.007388301457790476], "isController": false}, {"data": ["POST addtocart (item 18)", 16, 0, 0.0, 518.3125, 276, 882, 534.5, 674.1000000000003, 882.0, 882.0, 0.040166490101470595, 0.010443679677262252, 0.008786419709696694], "isController": false}, {"data": ["POST addtocart (item 19)", 16, 0, 0.0, 344.87499999999994, 276, 864, 295.0, 656.1000000000003, 864.0, 864.0, 0.040187979273049686, 0.010449267071728007, 0.008791120465979619], "isController": false}, {"data": ["POST addtocart (item 16)", 16, 0, 0.0, 300.875, 261, 514, 288.5, 372.60000000000014, 514.0, 514.0, 0.04022586825022501, 0.01047876011303469, 0.008799408679736722], "isController": false}, {"data": ["POST addtocart (item 17)", 16, 0, 0.0, 282.6875, 262, 302, 284.5, 296.4, 302.0, 302.0, 0.04043569460941646, 0.010503803482524198, 0.00884530819580985], "isController": false}, {"data": ["POST addtocart (item 1)", 16, 0, 0.0, 898.0625000000002, 274, 4716, 299.5, 3115.1000000000017, 4716.0, 4716.0, 0.04036724097476795, 0.010486021581336206, 0.00883033396323049], "isController": false}, {"data": ["POST addtocart (item 14)", 16, 0, 0.0, 581.5, 288, 1211, 553.0, 927.5000000000002, 1211.0, 1211.0, 0.04014865037802464, 0.010429239258354055, 0.008782517270192889], "isController": false}, {"data": ["POST addtocart (item 2)", 16, 0, 0.0, 589.4375, 298, 1107, 571.0, 799.7000000000003, 1107.0, 1107.0, 0.04014562826653686, 0.010428454217674615, 0.008781856183304938], "isController": false}, {"data": ["POST addtocart (item 15)", 16, 0, 0.0, 331.68749999999994, 274, 554, 292.5, 540.7, 554.0, 554.0, 0.0401615498342081, 0.010432590093651713, 0.008785339026233022], "isController": false}, {"data": ["POST addtocart (item 12)", 16, 0, 0.0, 297.75000000000006, 265, 316, 303.5, 313.9, 316.0, 316.0, 0.04000240014400864, 0.010410780896853811, 0.00875052503150189], "isController": false}, {"data": ["POST /login", 16, 0, 0.0, 446.31250000000006, 277, 771, 354.5, 723.4000000000001, 771.0, 771.0, 0.04054595123335716, 0.009819722564328686, 0.009163919520087986], "isController": false}, {"data": ["POST addtocart (item 13)", 16, 0, 0.0, 297.9375, 277, 315, 298.0, 315.0, 315.0, 315.0, 0.04018020823392918, 0.010437436904516758, 0.008789420551172007], "isController": false}, {"data": ["POST addtocart (item 5)", 16, 0, 0.0, 367.9375, 278, 748, 318.5, 566.7000000000002, 748.0, 748.0, 0.039988703191348444, 0.010397453344430199, 0.008747528823107472], "isController": false}, {"data": ["POST addtocart (item 10)", 16, 0, 0.0, 507.62500000000006, 279, 587, 552.5, 580.0, 587.0, 587.0, 0.03979535240028155, 0.010337464588354387, 0.00870523333756159], "isController": false}, {"data": ["POST addtocart (item 6)", 16, 0, 0.0, 669.25, 274, 1331, 579.5, 1307.2, 1331.0, 1331.0, 0.0399855052543453, 0.01038685976333579, 0.008746829274388034], "isController": false}, {"data": ["POST addtocart (item 11)", 16, 0, 0.0, 359.125, 285, 724, 303.0, 630.2, 724.0, 724.0, 0.039934906103052024, 0.01038346557611094, 0.008735760710042631], "isController": false}, {"data": ["POST addtocart (item 3)", 16, 0, 0.0, 365.0, 265, 668, 337.5, 593.8000000000001, 668.0, 668.0, 0.04017526459178165, 0.01043615271622453, 0.008788339129452236], "isController": false}, {"data": ["POST addtocart (item 4)", 16, 0, 0.0, 342.00000000000006, 283, 440, 321.0, 419.0, 440.0, 440.0, 0.040077248897249444, 0.010410691608074564, 0.008766898196273317], "isController": false}, {"data": ["POST addtocart (item 20)", 16, 0, 0.0, 308.125, 287, 554, 291.0, 379.00000000000017, 554.0, 554.0, 0.04031943068963866, 0.01048344572374638, 0.008819875463358457], "isController": false}, {"data": ["POST addtocart (item 9)", 16, 0, 0.0, 289.6875, 267, 312, 284.5, 311.3, 312.0, 312.0, 0.03984649139191266, 0.010350748740477311, 0.008716419991980893], "isController": false}, {"data": ["POST addtocart (item 7)", 16, 0, 0.0, 362.68750000000006, 279, 595, 301.0, 582.4, 595.0, 595.0, 0.03995684660566588, 0.010389170321053262, 0.008740560194989411], "isController": false}, {"data": ["GET /entries (browse products)", 16, 0, 0.0, 729.25, 332, 1379, 665.0, 1085.0000000000002, 1379.0, 1379.0, 0.04014421810353695, 0.11490498365377619, 0.006233330740685914], "isController": false}, {"data": ["POST addtocart (item 8)", 16, 0, 0.0, 327.87500000000006, 278, 602, 299.0, 546.0, 602.0, 602.0, 0.039816446183095926, 0.010352664840087199, 0.008709847602552234], "isController": false}, {"data": ["POST /viewcart", 16, 0, 0.0, 1619.6875, 948, 2418, 1667.5, 2307.4, 2418.0, 2418.0, 0.040126096257489155, 3.4084454147157444, 0.0076020143300321264], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 384, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
