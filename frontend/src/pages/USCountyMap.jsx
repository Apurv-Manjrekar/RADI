import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
const DATA_URL = import.meta.env.BASE_URL + 'full_final_df.csv';

const USCountyMap = () => {
  const svgRef = useRef();
  const containerRef = useRef();
  const gRef = useRef();
  const zoomRef = useRef();
  const [geoData, setGeoData] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [colorMetric, setColorMetric] = useState("RADI");

  // Track window size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load data
  useEffect(() => {
    Promise.all([
      d3.json(
        "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json"
      ),
      d3.csv(DATA_URL, d => ({
        ...d,
        FIPS: d.FIPS ? d.FIPS.toString().padStart(5, "0") : null,
        RADI: d.RADI === "" || d.RADI == null ? NaN : +d.RADI,
        SVI: d.SVI === "" || d.SVI == null ? NaN : +d.SVI,
        RUCC: d.RUCC === "" || d.RUCC == null ? NaN : +d.RUCC,
        Population: d.Population ? +d.Population : 0,
      }))
    ]).then(([geo, csv]) => {
      setGeoData(geo);
      setCsvData(csv);
    }).catch(err => {
      console.error("Data load error:", err);
      console.log("DATA_URL:", DATA_URL);
    });
  }, []);

  // Force re-render when showMap changes (especially on mobile)
  const [renderKey, setRenderKey] = useState(0);
  const showMap = !isMobile || !selectedCounty;
  const showPanel = selectedCounty;
  
  useEffect(() => {
    if (showMap && isMobile && geoData && csvData) {
      setRenderKey(prev => prev + 1);
    }
  }, [showMap, isMobile, geoData, csvData]);

  useEffect(() => {
    if (!geoData || !csvData || !showMap) return;

    const dataMap = new Map(csvData.map(r => [r.FIPS, r]));

    geoData.features.forEach(f => {
      const match = dataMap.get(f.id);
      if (match) {
        f.properties = { ...(f.properties || {}), ...match };
      }
    });

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const width = rect.width || 960;
    const height = rect.height || 600;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("display", "block");

    // Create a group for zoom/pan
    const g = svg.append("g");
    gRef.current = g;

    const projection = d3.geoAlbersUsa()
      .scale((width / 960) * 800)
      .translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    // Get extent based on selected metric
    const metricExtent = d3.extent(csvData, d => (isNaN(d[colorMetric]) ? undefined : d[colorMetric])).filter(v => v !== undefined);
    
    // Choose color scale based on metric
    const colorInterpolator = colorMetric === "RADI" ? d3.interpolatePurples :
                              colorMetric === "SVI" ? d3.interpolateOranges :
                              d3.interpolateBlues;
    
    const colorScale = d3.scaleSequential()
      .domain(metricExtent.length ? metricExtent : [0, 1])
      .interpolator(colorInterpolator);

    const tooltip = d3.select("#tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.75)")
      .style("color", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("pointer-events", "none")
      .style("font-size", "0.9rem")
      .style("opacity", 0)
      .style("z-index", 9999);

    // Draw counties
    g.selectAll("path")
      .data(geoData.features)
      .join("path")
      .attr("d", path)
      .attr("fill", d => {
        const v = d.properties && d.properties[colorMetric];
        return v == null || isNaN(v) ? "#ccc" : colorScale(v);
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.3)
      .style("cursor", d => (d.properties[colorMetric] == null || isNaN(d.properties[colorMetric]) ? "default" : "pointer"))
      .on("mousemove", (event, d) => {
        const props = d.properties || {};
        const hasData = props[colorMetric] != null && !isNaN(props[colorMetric]);
        if (!hasData) {
          tooltip.style("opacity", 0);
          return;
        }
        const [x, y] = d3.pointer(event, container);
        tooltip
          .style("opacity", 1)
          .style("left", `${x + 12}px`)
          .style("top", `${y - 28}px`)
          .html(`
            <div style="font-weight:600">${props.County ?? "Unknown"}, ${props.State ?? ""}</div>
            <div>RADI: ${(props.RADI ?? "N/A") === "N/A" ? "N/A" : (props.RADI).toFixed(2)}</div>
            <div>SVI: ${(props.SVI ?? "N/A") === "N/A" ? "N/A" : (props.SVI).toFixed(2)}</div>
            <div>RUCC: ${props.RUCC ?? "N/A"}</div>
            <div style="font-size:0.85rem;color:#ddd">Pop: ${d3.format(",")(props.Population ?? 0)}</div>
          `);
      })
      .on("mouseout", () => tooltip.style("opacity", 0))
      .on("click", (event, d) => {
        if (isNaN(d.properties[colorMetric])) return;
        tooltip.style("opacity", 0);
        event.preventDefault();
        event.stopPropagation();

        let props = d.properties && Object.keys(d.properties).length ? d.properties : null;

        if ((!props || Object.keys(props).length === 0) && dataMap.has(d.id)) {
          props = dataMap.get(d.id);
        }

        if (!props) {
          props = { FIPS: d.id, County: "Unknown", State: "", RADI: NaN };
        }

        setSelectedCounty({ ...props });
      });

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    zoomRef.current = zoom;
    
    svg.call(zoom);

    // Reset zoom function (exposed globally for reset button)
    window.resetMapZoom = () => {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    };

    return () => {
      window.resetMapZoom = null;
    };

  }, [geoData, csvData, renderKey, showMap, colorMetric]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        width: "100vw",
        height: "80vh",
        position: "fixed",
        top: "10vh",
        left: 0,
        overflow: "hidden",
        background: "#fff",
        margin: 0,
        padding: 0
      }}
    >
      {/* Map area */}
      {showMap && (
        <div
          style={{
            flex: selectedCounty && !isMobile ? "0 0 70%" : "1 1 100%",
            transition: "flex 300ms ease",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden"
          }}
        >
          <svg
            ref={svgRef}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              touchAction: "none"
            }}
          />
          
          {/* Metric selector dropdown */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 1000
            }}
          >
            <label
              htmlFor="metric-select"
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: 12,
                fontWeight: "600",
                color: "#333"
              }}
            >
              Color by:
            </label>
            <select
              id="metric-select"
              value={colorMetric}
              onChange={(e) => setColorMetric(e.target.value)}
              style={{
                padding: "6px 12px",
                fontSize: 14,
                border: "2px solid #333",
                borderRadius: 6,
                background: "white",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              <option value="RADI">RADI</option>
              <option value="SVI">SVI</option>
              <option value="RUCC">RUCC</option>
            </select>
          </div>

          {/* Zoom controls */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              zIndex: 1000
            }}
          >
            <button
              onClick={() => {
                const svg = d3.select(svgRef.current);
                const bbox = svgRef.current.getBoundingClientRect();
                const cx = bbox.width / 2;
                const cy = bbox.height / 2;

                zoomRef.current.scaleBy(
                  svg.transition().duration(300),
                  1.5,
                  [cx, cy]
                );
              }}
              style={{
                width: 40,
                height: 40,
                background: "white",
                border: "2px solid #333",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 20,
                fontWeight: "bold"
              }}
            >
              +
            </button>
            <button
              onClick={() => {
                const svg = d3.select(svgRef.current);
                const bbox = svgRef.current.getBoundingClientRect();
                const cx = bbox.width / 2;
                const cy = bbox.height / 2;

                zoomRef.current.scaleBy(
                  svg.transition().duration(300),
                  0.67,
                  [cx, cy]
                );
              }}
              style={{
                width: 40,
                height: 40,
                background: "white",
                border: "2px solid #333",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 20,
                fontWeight: "bold"
              }}
            >
              −
            </button>
            <button
              onClick={() => window.resetMapZoom && window.resetMapZoom()}
              style={{
                width: 40,
                height: 40,
                background: "white",
                border: "2px solid #333",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: "bold"
              }}
            >
              ⟲
            </button>
          </div>

          <div id="tooltip" />
        </div>
      )}

      {/* Detail panel */}
      {showPanel && (
        <div
          style={{
            flex: isMobile ? "1 1 100%" : "0 0 30%",
            minWidth: isMobile ? "100%" : 320,
            borderLeft: isMobile ? "none" : "1px solid #e6e6e6",
            background: "#fafafa",
            padding: 18,
            overflowY: "auto",
            boxShadow: isMobile ? "none" : "-6px 0 18px rgba(0,0,0,0.04)",
            transition: "transform 300ms ease"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <h3 style={{ margin: 0 }}>
              {selectedCounty.County ?? "Unknown"}, {selectedCounty.State ?? ""}
            </h3>
            <button
              onClick={() => setSelectedCounty(null)}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                lineHeight: 1
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <p style={{ margin: "6px 0" }}><strong>FIPS:</strong> {selectedCounty.FIPS ?? "N/A"}</p>
            <p style={{ margin: "6px 0" }}><strong>Population:</strong> {d3.format(",")(selectedCounty.Population ?? 0)}</p>
            <p style={{ margin: "6px 0" }}><strong>RADI:</strong> {isNaN(selectedCounty.RADI) ? "N/A" : selectedCounty.RADI.toFixed(2)}</p>
            <p style={{ margin: "6px 0" }}><strong>SVI:</strong> {isNaN(selectedCounty.SVI) ? "N/A" : selectedCounty.SVI.toFixed(2)}</p>
            <p style={{ margin: "6px 0" }}><strong>RUCC:</strong> {selectedCounty.RUCC ?? "N/A"}</p>
          </div>

          <hr />

          <h4>Health Disparity Metrics</h4>
          <ul>
            <li>Premature Mortality: {selectedCounty["Premature Mortality"] ?? "N/A"}</li>
            <li>Infant Mortality: {selectedCounty["Infant Mortality"] ?? "N/A"}</li>
            <li>Preventable Hospital Stays: {selectedCounty["Preventable Hospital Stays"] ?? "N/A"}</li>
            <li>Heart Disease Mortality: {selectedCounty["Heart Disease Mortality"] ?? "N/A"}</li>
            <li>Poor or Fair Health: {selectedCounty["Poor or Fair Health"] ?? "N/A"}</li>
            <li>Median Income: {selectedCounty["Median Income"] ?? "N/A"}</li>
            <li>No Internet: {selectedCounty["No Internet"] ?? "N/A"}</li>
            <li>No College: {selectedCounty["No College"] ?? "N/A"}</li>
            <li>Ratio of Mental Health Providers to Population: {selectedCounty["Ratio of Mental Health Providers to Population"] ?? "N/A"}</li>
            <li>Percent Non-White: {selectedCounty["Percent Non-White"] ?? "N/A"}</li>
            <li>Poverty: {selectedCounty["Poverty"] ?? "N/A"}</li>
            <li>No Plumbing Facilities: {selectedCounty["No Plumbing Facilities"] ?? "N/A"}</li>
            <li>65+: {selectedCounty["65+"] ?? "N/A"}</li>
            <li>No High School: {selectedCounty["No High School"] ?? "N/A"}</li>
            <li>No Vehicle: {selectedCounty["No Vehicle"] ?? "N/A"}</li>
            <li>Housing Cost Burden: {selectedCounty["Housing Cost Burden"] ?? "N/A"}</li>
            <li>Ratio of Population to Primary Care Physicians: {selectedCounty["Ratio of Population to Primary Care Physicians"] ?? "N/A"}</li>
            <li>Unemployment: {selectedCounty["Unemployment"] ?? "N/A"}</li>
            <li>Uninsured: {selectedCounty["Uninsured"] ?? "N/A"}</li>
            <li>Long Commutes: {selectedCounty["Long Commutes"] ?? "N/A"}</li>
            <li>Drinking Water Violations: {selectedCounty["Drinking Water Violations"] ?? "N/A"}</li>
            <li>Natural Disaster Risk: {selectedCounty["Natural Disaster Risk"] ?? "N/A"}</li>
            <li>Food Insecurity: {selectedCounty["Food Insecurity"] ?? "N/A"}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default USCountyMap;