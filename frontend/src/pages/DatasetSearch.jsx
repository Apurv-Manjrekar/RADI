import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { Search, X, ArrowUpDown, Filter } from "lucide-react";
const DATA_URL = import.meta.env.BASE_URL + 'full_final_df.csv';


const DatasetSearch = () => {
  const [csvData, setCsvData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterColumn, setFilterColumn] = useState("RADI");
  const [topN, setTopN] = useState(10);
  const [loading, setLoading] = useState(true);

  // Load CSV data
  useEffect(() => {
    d3.csv(DATA_URL, d => ({
      ...d,
      FIPS: d.FIPS ? d.FIPS.toString().padStart(5, "0") : null,
      RADI: d.RADI === "" || d.RADI == null ? NaN : +d.RADI,
      SVI: d.SVI === "" || d.SVI == null ? NaN : +d.SVI,
      RUCC: d.RUCC === "" || d.RUCC == null ? NaN : +d.RUCC,
      Population: d.Population ? +d.Population : 0,
      "Premature Mortality": d["Premature Mortality"] === "" ? NaN : +d["Premature Mortality"],
      "Infant Mortality": d["Infant Mortality"] === "" ? NaN : +d["Infant Mortality"],
      "Preventable Hospital Stays": d["Preventable Hospital Stays"] === "" ? NaN : +d["Preventable Hospital Stays"],
      "Heart Disease Mortality": d["Heart Disease Mortality"] === "" ? NaN : +d["Heart Disease Mortality"],
      "Poor or Fair Health": d["Poor or Fair Health"] === "" ? NaN : +d["Poor or Fair Health"],
      "Median Income": d["Median Income"] === "" ? NaN : +d["Median Income"],
      "No Internet": d["No Internet"] === "" ? NaN : +d["No Internet"],
      "No College": d["No College"] === "" ? NaN : +d["No College"],
    }))
    .then(data => {
      setCsvData(data);
      setFilteredData(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Data load error:", err);
      setLoading(false);
      console.log("DATA_URL:", DATA_URL);
    });
  }, []);

  // Filter data based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(csvData);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = csvData.filter(row => {
      const county = (row.County || "").toLowerCase();
      const state = (row.State || "").toLowerCase();
      const fips = (row.FIPS || "").toLowerCase();
      
      return county.includes(term) || state.includes(term) || fips.includes(term);
    });

    setFilteredData(filtered);
  }, [searchTerm, csvData]);

  // Sort data
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      // Handle NaN values
      if (isNaN(aVal) && isNaN(bVal)) return 0;
      if (isNaN(aVal)) return 1;
      if (isNaN(bVal)) return -1;

      // Handle numeric vs string
      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      // String comparison
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
    setSortConfig({ key, direction });
  };

  // Get top N by column
  const handleTopN = () => {
    if (!filterColumn) return;

    const validData = csvData.filter(row => {
      const val = row[filterColumn];
      return val != null && !isNaN(val);
    });

    const sorted = [...validData].sort((a, b) => b[filterColumn] - a[filterColumn]);
    setFilteredData(sorted.slice(0, topN));
    setSortConfig({ key: filterColumn, direction: "desc" });
    setSearchTerm("");
  };

  const handleReset = () => {
    setFilteredData(csvData);
    setSearchTerm("");
    setSortConfig({ key: null, direction: "asc" });
  };
  /*
  'Premature Mortality', 'Infant Mortality',
       'Preventable Hospital Stays', 'Heart Disease Mortality',
       'Poor or Fair Health', 'Median Income', 'No Internet', 'No College',
       'Ratio of Mental Health Providers to Population', 'Percent Non-White',
       'Poverty', 'No Plumbing Facilities', '65+', 'No High School',
       'No Vehicle', 'Housing Cost Burden',
       'Ratio of Population to Primary Care Physicians', 'Unemployment',
       'Uninsured', 'Long Commutes', 'Drinking Water Violations',
       'Natural Disaster Risk', 'Food Insecurity'
  */
  const numericColumns = [
    "RADI", "SVI", "RUCC", "Population", 
    "Premature Mortality", "Infant Mortality", 
    "Preventable Hospital Stays", "Heart Disease Mortality",
    "Poor or Fair Health", "Median Income", 
    "No Internet", "No College", 
    "Ratio of Mental Health Providers to Population", "Percent Non-White",
    "Poverty", "No Plumbing Facilities", "65+", "No High School",
    "No Vehicle", "Housing Cost Burden",
    "Ratio of Population to Primary Care Physicians", "Unemployment",
    "Uninsured", "Long Commutes", "Drinking Water Violations",
    "Natural Disaster Risk", "Food Insecurity"
  ];

  const displayColumns = ["County", "State", "FIPS", "Population", "RADI", "SVI", "RUCC",
    "Premature Mortality", "Infant Mortality",
    "Preventable Hospital Stays", "Heart Disease Mortality",
    "Poor or Fair Health", "Median Income",
    "No Internet", "No College",
    "Ratio of Mental Health Providers to Population", "Percent Non-White",
    "Poverty", "No Plumbing Facilities", "65+", "No High School",
    "No Vehicle", "Housing Cost Burden",
    "Ratio of Population to Primary Care Physicians", "Unemployment",
    "Uninsured", "Long Commutes", "Drinking Water Violations",
    "Natural Disaster Risk", "Food Insecurity"
  ];

  return (
    <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto", padding: "20px" }}>
      <h2 style={{ marginBottom: 24, fontSize: 28, fontWeight: 600 }}>Dataset Search & Filter</h2>

      {/* Search and Filter Controls */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 16, 
        marginBottom: 24,
        padding: 20,
        background: "#f8f9fa",
        borderRadius: 8,
        border: "1px solid #e0e0e0"
      }}>
        {/* Search Bar */}
        <div style={{ position: "relative" }}>
          <Search 
            size={20} 
            style={{ 
              position: "absolute", 
              left: 12, 
              top: "50%", 
              transform: "translateY(-50%)",
              color: "#666"
            }} 
          />
          <input
            type="text"
            placeholder="Search by county, state, or FIPS code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 40px 10px 42px",
              fontSize: 15,
              border: "1px solid #ccc",
              borderRadius: 6,
              outline: "none"
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4
              }}
            >
              <X size={18} color="#666" />
            </button>
          )}
        </div>

        {/* Top N Filter */}
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap",
          gap: 12, 
          alignItems: "center",
          padding: "12px 0"
        }}>
          <Filter size={20} color="#555" />
          <span style={{ fontSize: 15, fontWeight: 500, color: "#333" }}>Show top</span>
          <input
            type="number"
            value={topN}
            onChange={(e) => setTopN(Math.max(1, parseInt(e.target.value) || 10))}
            min="1"
            max="1000"
            style={{
              width: 70,
              padding: "6px 10px",
              fontSize: 15,
              border: "1px solid #ccc",
              borderRadius: 4
            }}
          />
          <span style={{ fontSize: 15, color: "#333" }}>counties by highest</span>
          <select
            value={filterColumn}
            onChange={(e) => setFilterColumn(e.target.value)}
            style={{
              padding: "6px 12px",
              fontSize: 15,
              border: "1px solid #ccc",
              borderRadius: 4,
              background: "white",
              cursor: "pointer"
            }}
          >
            {numericColumns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          <button
            onClick={handleTopN}
            style={{
              padding: "8px 18px",
              background: "#1677ff",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 500
            }}
          >
            Apply Filter
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: "8px 18px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 500
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ marginBottom: 16, fontSize: 15, color: "#555" }}>
        Showing <strong>{filteredData.length}</strong> of <strong>{csvData.length}</strong> counties
      </div>

      {/* Data Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, fontSize: 16 }}>Loading data...</div>
      ) : (
        <div style={{ 
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "600px",
          border: "1px solid #e0e0e0", 
          borderRadius: 8,
          background: "white"
        }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            fontSize: 14
          }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
              <tr style={{ background: "#f5f5f5" }}>
                {displayColumns.map(col => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      cursor: "pointer",
                      borderBottom: "2px solid #ddd",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                      background: "#f5f5f5"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {col}
                      <ArrowUpDown size={14} color="#999" />
                      {sortConfig.key === col && (
                        <span style={{ fontSize: 12, color: "#1677ff" }}>
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={displayColumns.length} 
                    style={{ 
                      padding: 40, 
                      textAlign: "center",
                      color: "#999"
                    }}
                  >
                    No counties found matching your search
                  </td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr 
                    key={row.FIPS || idx}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      transition: "background 0.15s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f9f9f9"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    {displayColumns.map(col => {
                      let value = row[col];
                      
                      // Format numbers
                      if (typeof value === "number") {
                        if (col === "Population") {
                          value = d3.format(",")(value);
                        } else if (!isNaN(value)) {
                          value = value.toFixed(2);
                        }
                      }
                      
                      if (value == null || (typeof value === "number" && isNaN(value))) {
                        value = "N/A";
                      }

                      return (
                        <td 
                          key={col}
                          style={{ 
                            padding: "12px 16px",
                            color: value === "N/A" ? "#999" : "#333"
                          }}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DatasetSearch;