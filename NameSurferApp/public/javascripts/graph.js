google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(setUpGraph);

years = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000];

let chart;
let data;

function setUpGraph() {
    chart = new google.visualization.LineChart(document.getElementById('graph'));
    data = new google.visualization.DataTable();
    data.addColumn('number', 'Year');
    data.addRows(years.length);
    years.forEach(function (value, index) {
        data.setCell(index, 0, value);
    });
}

function drawGraph() {
    const options = {
        title: 'Baby Name Ranking',
        curveType: 'function',
        legend: {position: 'bottom'},
        hAxis: {
            ticks: years,
            format: ''
        },
        vAxis: {
            minValue: 1,
            maxValue: 1001,
            direction: -1,
            format: ''
        }
    };

    if (data.getNumberOfColumns() > 1) {
        chart.draw(data, options);
    }
}

function addLine(namePop) {
    data.addColumn('number', namePop['name']);
    let colNum = data.getNumberOfColumns() - 1;
    years.map(String).forEach((year, index) =>{
        data.setCell(index, colNum, namePop[year]);
    });
    drawGraph();
}

$(document).ready(() => {
    $('#input').on('change', (evt)=> {
        let text = $('#input').val();
        $.get('/namesurfer', { text: text })
            .done((nameData) => {
                console.log(nameData);
                if(nameData['result'] === 'Name not found'){
                    alert("Name not found.");
                }
                else {
                    addLine(nameData);
                    drawGraph();
                    $('#input').val('');
                }
            })
            .fail((xhr)=>{
                alert('Problem contacting server');
                console.log(xhr);
            });
    });
});