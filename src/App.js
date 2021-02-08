import React, { useEffect, useState } from "react";
import "./App.css";
import FormData from "./components/FormData";

function App() {
  const [data, updateData] = useState({});
  const API = "https://api.mfapi.in/mf/102885";
  const [finalData, updatefinalData] = useState([]);
  const [poi, updatePoi] = useState("");
  const [horizon, updateHorizon] = useState("");

  useEffect(() => {
    async function fetchData() {
      const resp = await fetch(API);
      const json = await resp.json();
      if (json != null || json != undefined) {
        updateData(json["data"]);
      }
    }
    fetchData();
  }, []);

  function handleEvent(event) {
    const value = event.target.value;
    const name = event.target.name;
    if (name == "poi") {
      updatePoi(value);
    } else {
      updateHorizon(value);
    }
  }

  function filterData(e) {
    e.preventDefault();
    filterData = [];
    var poi = document.getElementById("poi").value;
    poi = parseInt(poi);
    var horizon = document.getElementById("horizon").value;
    horizon = parseInt(horizon);
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var nextYear = currentDate.getFullYear() - horizon;
    var index = horizon;
    var obj;
    while (nextYear <= currentYear) {
      var diff = index + poi;
      var start = new Date(
        new Date().setFullYear(new Date().getFullYear() - diff)
      );
      var startDate = start.toLocaleDateString();
      var next = new Date(
        new Date().setFullYear(new Date().getFullYear() - index)
      );
      nextYear = next.getFullYear();
      var nextDate = next.toLocaleDateString();
      if (nextYear > currentYear) {
        break;
      }
      var sMonth = startDate.split("/");
      var currMonth = sMonth[0];
      sMonth = sMonth[0];
      var tMonths = 12;
      while (sMonth <= tMonths) {
        if (nextYear >= currentYear && sMonth > currMonth) {
          break;
        }
        obj = getRecord(startDate, nextDate);
        filterData.push(obj);
        start = new Date(start.setMonth(start.getMonth() + 1));
        var startDate = start.toLocaleDateString();
        next = new Date(next.setMonth(next.getMonth() + 1));
        var nextDate = next.toLocaleDateString();
        sMonth++;
      }
      index--;
    }
    updatefinalData(filterData);
  }

  function getRecord(start, end) {
    start = formatDate(start);
    end = formatDate(end);
    var startNAV = "";
    var endNAV = "";
    for (var i = 0; i < data.length; i++) {
      if (data[i]["date"] == start) {
        startNAV = data[i]["nav"];
      }
      if (data[i]["date"] == end) {
        endNAV = data[i]["nav"];
      }
      if (startNAV != "" && endNAV != "") {
        break;
      }
    }
    if (startNAV == "") {
      startNAV = "0";
    }
    if (endNAV == "") {
      endNAV = "0";
    }
    var returns = "";
    if (startNAV == "0" || endNAV == "0") {
      returns = "0";
    } else {
      returns = calReturn(startNAV, endNAV, start, end);
    }
    var startObj = start.split("-");
    var endObj = end.split("-");
    var obj = {
      month: getMonthFromDate(endObj[1]) + "-" + endObj[2],
      returns: returns,
      calculations: {
        start:
          "Start nav - " +
          startObj[0] +
          "-" +
          getMonthFromDate(startObj[1]) +
          "-" +
          startObj[2],
        end:
          "End nav - " +
          endObj[0] +
          "-" +
          getMonthFromDate(endObj[1]) +
          "-" +
          endObj[2],
      },
    };
    return obj;
  }

  function getMonthFromDate(month) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var validMonth = month.split("");
    if (validMonth[0] == 0) {
      month = validMonth[1];
    }
    month = month - 1;
    return monthNames[month];
  }

  function formatDate(date) {
    var data = date.split("/");
    if (data[1].length < 2) data[1] = "0" + data[1];
    if (data[0].length < 2) data[0] = "0" + data[0];
    return data[1] + "-" + data[0] + "-" + data[2];
  }

  function calReturn(startNAV, endNAV, start, end) {
    var startyr = start.split("-");
    startyr = startyr[2];
    var endyr = end.split("-");
    endyr = endyr[2];

    var diff = endyr - startyr;
    var power = 1 / diff;
    var result = endNAV / startNAV;

    var returns = Math.pow(result, power);
    returns = returns - 1;
    return Math.trunc(returns * 100) + "%";
  }

  return (
    <div className="App">
      <FormData
        filterData={filterData}
        handleEvent={handleEvent}
        poi={poi}
        horizon={horizon}
      />
      <br></br>
      <b>RESULT: </b>
      <span>{JSON.stringify(finalData)}</span>
    </div>
  );
}

export default App;
