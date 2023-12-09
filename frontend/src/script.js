//import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
import Chart from 'chart.js/auto'

var xhr = null;
//This adds an event listener to all of my tiles
var selectedTile = new Array();

const tickerGraph = document.getElementById('ticker-graph');



document.addEventListener('DOMContentLoaded', function() {
    const tileList = document.querySelectorAll(".tile");
    tileList.forEach(function (tile) {
    
        tile.addEventListener("click", function () {
            if (tile.style.backgroundColor == 'lightblue') {
                tile.style.backgroundColor = 'white';
            } else {
                //Deselect any other tile.
                tileList.forEach(function (tile) {
                    tile.style.backgroundColor = 'white';
                })
                //select current tile
                tile.style.backgroundColor = 'lightblue';
            }
        })
    });
    
    document.getElementById("ticker-search").addEventListener("keyup", function (event) {
        if (event.keyCode == 13) {
            searchTicker();
        }
    });
})


getXmlHttpRequestObject = function () {
    if (!xhr) {
        xhr = new XMLHttpRequest();
    }
    return xhr;
};

window.onload = function () {
    //loadHistory();
    loadTopPerformers();
};


function loadTPCallBack() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log("Load response received.");
        //historyDiv = document.getElementById('history-container');
        //historyDiv.innerHTML = xhr.responseText;
        console.log(`Data returned: ${xhr.responseText}`);
        
        //Turn the string back into JSON
        const content = JSON.parse(xhr.responseText);
        console.log(content[0].ticker);

        var tileOne = document.getElementById('best-performer-1');
        tileOne.innerHTML = `<h3>${content[0].ticker}</h3>
                            <p>Price: $${content[0].price}</p>
                            <p>Change Percentage: ${content[0].change_percentage}</p>
                            <p>Volume: ${content[0].volume}</p>`;
        
        var tileTwo = document.getElementById('best-performer-2');
        tileTwo.innerHTML = `<h3>${content[1].ticker}</h3>
                            <p>Price: $${content[1].price}</p>
                            <p>Change Percentage: ${content[1].change_percentage}</p>
                            <p>Volume: ${content[1].volume}</p>`;  
        var tileThree = document.getElementById('best-performer-3');
        tileThree.innerHTML = `<h3>${content[2].ticker}</h3>
                            <p>Price: $${content[2].price}</p>
                            <p>Change Percentage: ${content[2].change_percentage}</p>
                            <p>Volume: ${content[2].volume}</p>`; 
        var tileFour = document.getElementById('best-performer-4');
        tileFour.innerHTML = `<h3>${content[3].ticker}</h3>
                            <p>Price: $${content[3].price}</p>
                            <p>Change Percentage: ${content[3].change_percentage}</p>
                            <p>Volume: ${content[3].volume}</p>`;      
    }
};

function loadTopPerformers() {
    console.log("Loading user search history...");
    xhr = getXmlHttpRequestObject();
    xhr.onreadystatechange = loadTPCallBack;

    //Asynchronous request
    xhr.open("GET", "http://localhost:6969/", true);
    xhr.send(null);
};

function searchTickerCallback() {
    console.log("We are in the callback");
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log("Search response received.");
        
        //The response text here is the graph data currently
        const some_data = JSON.parse(xhr.responseText);
        console.log(some_data);
        var xValues = new Array();
        var yValues = new Array();

        for (const key in some_data) {
            if(some_data.hasOwnProperty(key)){
                console.log(`${key} : ${some_data[key]}`);
                xValues.push(key);
                yValues.push(some_data[key]);
            }
        }

        new Chart(tickerGraph, {
            type: "line",
            data: {
              labels: xValues,
              datasets: [{
                backgroundColor:"rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: yValues
              }]
            }
          });
    }
}

function searchTicker() {
    tickerToSearch = document.getElementById('ticker-search').value;
    if (!tickerToSearch) {
        console.log("No ticker entered.");
        return;
    }
    console.log("Searching ticker " + tickerToSearch);
    xhr = getXmlHttpRequestObject();
    xhr.onreadystatechange = searchTickerCallback;

    //Asynchronous request
    xhr.open("POST", "http://localhost:6969/", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ "data": tickerToSearch }));
}

const submitButton = document.getElementById('submit-button');

submitButton.onclick = function(){
    searchTicker();
};