const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div style={{ backgroundColor: "#fff", border: "1px solid #ccc", padding: "10px" }}>
        <p><strong>{label}</strong></p>
        <p>Trainings: {data.count}</p>
        {data.names && data.names.length > 0 && (
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            {data.names.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;