import React from 'react';
import FetchHelper from '../fetch-helper'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltip from './custom_tool';
import 'bootstrap/dist/css/bootstrap.min.css';

export class ProgressBoard extends React.Component {

  constructor(props) {
    super(props);
      this.state = {
        records: [],
        chartData: [],
        yMax: 10,
        selectedYear:new Date().getFullYear(),
        showModal: false,
        modalMonth: "",
        modalRecords: [],
        showExercisePanel: false,
        selectedExerciseId: null,
        selectedParam: "reps",
        viewByMonth: false,
        selectedExerciseYear: new Date().getFullYear(),
        selectedExerciseMonth: new Date().getMonth(),
        exerciseChartData: [],
        exerciseOptions: [],
      }}

  componentDidMount() {
    this.loadRecordsForYear(this.state.selectedYear).then(() => {
      // console.log(this.state.records);
      this.updateExerciseOptions();
      
    });
  }

  handleExerciseSelect = (e) => {
    this.setState({ selectedExerciseId: e.target.value }, this.loadExerciseChart);
  };

  handleParamSelect = (e) => {
    this.setState({ selectedParam: e.target.value }, this.loadExerciseChart);
  };

  handleExerciseYearChange = (e) => {
    this.setState({ selectedExerciseYear: parseInt(e.target.value) }, this.loadExerciseChart);
  };

  handleExerciseMonthChange = (e) => {
    this.setState({ selectedExerciseMonth: parseInt(e.target.value) }, this.loadExerciseChart);
  };

  updateExerciseOptions = () => {
    const validExercises = ["Push Ups", "Squats", "Lifting", "Marathon", "Swimming"];
    const options = validExercises.map((name) => (
      <option key={name} value={name}>{name}</option>
    ));

    this.setState({ exerciseOptions: options });
  };

  loadExerciseChart = async () => {
    const {
      selectedExerciseId,
      selectedParam,
      viewByMonth,
      selectedExerciseYear,
      selectedExerciseMonth,
      records,
    } = this.state;

    const targetExerciseName = selectedExerciseId;
    const isMonth = viewByMonth;
    const grouped = new Map();

    for (const record of records) {
      const date = new Date(record.date);
      const y = date.getFullYear();
      const m = date.getMonth();

      if (
        (!isMonth && y !== selectedExerciseYear) ||
        (isMonth && (y !== selectedExerciseYear || m !== selectedExerciseMonth))
      ) continue;

      for (const id of record.exerciseID) {
        try {
          const response = await FetchHelper.exercise.get({ id });
          if (!response.ok) continue;

          const exercise = response.data;
          if (exercise.name !== targetExerciseName) continue;

          const key = date.toISOString().split("T")[0];
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key).push(exercise);
        } catch (err) {
          console.error("Error:", err);
        }
      }
    }
    const chartData = [];

    if (isMonth) {
      for (let d = 1; d <= 31; d++) {
        const key = `${selectedExerciseYear}-${String(selectedExerciseMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

        const dayVal = grouped.has(key)
          ? grouped.get(key).reduce((sum, ex) => {
              let value = ex[selectedParam];
              if (selectedParam === "duration" && typeof value === "string") {
                const parts = value.split(":").map(Number);
                if (parts.length === 3) {
                  value = parts[0] * 3600 + parts[1] * 60 + parts[2];
                } else {
                  value = 0;
                }
              }
              return sum + (typeof value === "number" ? value : 0);
            }, 0)
          : 0;

        chartData.push({ day: d.toString(), value: dayVal });
      }
    } else {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthData = Array(12).fill(0);

      for (let [dateStr, exList] of grouped.entries()) {
        const month = new Date(dateStr).getMonth();
        monthData[month] += exList.reduce((sum, ex) => {
          let value = ex[selectedParam];
          if (selectedParam === "duration" && typeof value === "string") {
            const parts = value.split(":").map(Number);
            if (parts.length === 3) {
              value = parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else {
              value = 0;
            }
          }
          return sum + (typeof value === "number" ? value : 0);
        }, 0);
      }

      for (let i = 0; i < 12; i++) {
        chartData.push({ month: monthNames[i], value: monthData[i] });
      }
    }

    this.setState({ exerciseChartData: chartData });
  };


  getExerciseOptions = async () => {
    const seen = new Set();
    const { records } = this.state;

    for (const record of records) {
      for (const id of record.exerciseID) {
        try {
          const response = await FetchHelper.exercise.get({ id });
          if (response.ok) {
            seen.add(response.data.name);
          }
        } catch (err) {
          console.warn("Error:", err);
        }
      }
    }

    const valid = ["Push Ups", "Squats", "Lifting", "Marathon", "Swimming"];
    return valid
      .filter((name) => seen.has(name))
      .map((name) => <option key={name} value={name}>{name}</option>);
  };

  handleBarClick = (data) => {
    const monthIndex = this.getMonthIndex(data.month);
    const recordsForMonth = this.state.records.filter((record) => {
      return new Date(record.date).getMonth() === monthIndex;
    });

    this.setState({
      showModal: true,
      modalMonth: data.month,
      modalRecords: recordsForMonth,
    });
  };

  getMonthIndex = (shortMonthName) => {
    const map = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return map.indexOf(shortMonthName);
  };

  async loadRecordsForYear(year) {
    try {
      const response = await FetchHelper.wrecord.load({
        daterate: "year",
        year,
      });

      if (response.ok) {
        const sortedData = response.data.sort((a, b) =>
          new Date(a.date) - new Date(b.date)
        );

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthData = new Array(12).fill(0);
        const monthNamesPerMonth = Array(12).fill(null).map(() => []);

        sortedData.forEach((record) => {
          const month = new Date(record.date).getMonth();
          const names = [record.name];
          monthData[month]++;
          monthNamesPerMonth[month].push(...names);
        });

        const chartData = monthData.map((_, index) => ({
          month: monthNames[index],
          count: monthData[index],
          names: monthNamesPerMonth[index] || [],
        }));

        const maxCount = Math.max(...monthData);

        this.setState({
          records: sortedData,
          chartData,
          yMax: maxCount + 3,
        });

        return true;
      } else {
        console.error("Error:", response.status);
        return false;
      }
    } catch (err) {
      console.error("Fetch:", err);
      return false;
    }
  }


  render() {

    return (
      <div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={this.state.chartData}
          margin={{ top: 20, right: 80, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, this.state.yMax]} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
          dataKey="count" 
          fill="#8884d8" 
          name="Тренировок"
          onClick={(data) => this.handleBarClick(data)}
           />
        </BarChart>
      </ResponsiveContainer>

      {this.state.showExercisePanel && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={this.state.exerciseChartData} 
            margin={{ top: 20, right: 80, left: 20, bottom: 5 }}> 
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={this.state.viewByMonth ? "day" : "month"} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}

      {this.state.showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Training for {this.state.modalMonth}</h5>
                <button type="button" className="btn-close" onClick={() => this.setState({ showModal: false })}></button>
              </div>
              <div className="modal-body">
                {this.state.modalRecords.length > 0 ? (
                  <ul>
                    {this.state.modalRecords.map((rec, idx) => (
                      <li key={idx}>
                        {rec.name} — {new Date(rec.date).toLocaleDateString("ru-RU")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No trainings that month.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="year-select" className="form-label">
          Choose year:
        </label>
        <select
          id="year-select"
          className="form-select w-auto"
          value={this.state.selectedYear}

          onChange={(e) => {
            const year = parseInt(e.target.value);
            this.setState({ selectedYear: year }, () => {
              this.loadRecordsForYear(year);
          });}}>

            {[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <button
          className={`btn ${this.state.showExercisePanel ? "btn-secondary" : "btn-outline-secondary"}`}
          onClick={() =>
            this.setState((prev) => ({
              showExercisePanel: !prev.showExercisePanel,
              selectedExerciseYear: new Date().getFullYear(),
            }), this.loadExerciseChart)
          }
        >
          Exercise
        </button>
      </div>

      {this.state.showExercisePanel && (
        <div className="border rounded p-3 mb-3" style={{ maxWidth: "600px" }}>
          <div className="mb-2">
            <label className="form-label">Choose exercise:</label>
            <select className="form-select" onChange={this.handleExerciseSelect}>
              {this.state.exerciseOptions}
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label">Choose value:</label>
            <select className="form-select" onChange={this.handleParamSelect}>
               <option value="sets">Sets</option>
              <option value="reps">Reps</option>
              <option value="weight">Weight</option>
              <option value="duration">Duration</option>
              <option value="distance">Distance</option>
            </select>
          </div>

          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="timeSwitch"
              checked={this.state.viewByMonth}
              onChange={() => {
                const currentYear = new Date().getFullYear();
                this.setState(
                  (prev) => ({
                    viewByMonth: !prev.viewByMonth,
                    selectedExerciseYear: currentYear, 
                  }),
                  this.loadExerciseChart
                );
              }}
            />
            <label className="form-check-label" htmlFor="timeSwitch">
              {this.state.viewByMonth ? "Month" : "Year"}
            </label>
          </div>

          {!this.state.viewByMonth ? (
            <select className="form-select" value={this.state.selectedExerciseYear} onChange={this.handleExerciseYearChange}>
              {[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          ) : (
            <select className="form-select" value={this.state.selectedExerciseMonth} onChange={this.handleExerciseMonthChange}>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          )}
        </div>
      )}

    </div>
    );
  }
}

export default ProgressBoard;