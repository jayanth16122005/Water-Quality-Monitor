import React, { useState, useEffect } from 'react';

const PredictiveAlerts = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookbackDays, setLookbackDays] = useState(7);
  const [autoAnalysis, setAutoAnalysis] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch('http://localhost:8000/stations/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStations(data);
      if (data.length > 0) {
        setSelectedStation(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const analyzePredictions = async () => {
    if (!selectedStation) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/predict/analyze/${selectedStation}?lookback_days=${lookbackDays}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPredictions(data.predicted_alerts);
    } catch (error) {
      console.error('Error analyzing predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendAnalysis = async () => {
    if (!selectedStation) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/predict/trends/${selectedStation}?lookback_days=${lookbackDays}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTrends(data);
      setPredictions(data.predictions);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAutoAnalysis = async () => {
    if (user?.role !== 'authority') {
      alert('Only authorities can run auto-prediction analysis');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/predict/auto-predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      alert(`Analysis complete! Created ${data.alerts_created} alerts from ${data.stations_analyzed} stations.`);
      setAutoAnalysis(true);
      setTimeout(() => setAutoAnalysis(false), 3000);
    } catch (error) {
      console.error('Error running auto-analysis:', error);
      alert('Error running auto-prediction analysis');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (!severity) return '#gray';
    const colors = {
      'critical': '#dc2626',
      'high': '#f97316',
      'medium': '#eab308',
      'low': '#22c55e'
    };
    return colors[severity] || '#6b7280';
  };

  const getSeverityBg = (severity) => {
    if (!severity) return '#f3f4f6';
    const colors = {
      'critical': '#fee2e2',
      'high': '#fed7aa',
      'medium': '#fef3c7',
      'low': '#dcfce7'
    };
    return colors[severity] || '#f9fafb';
  };

  const containerStyle = {
    padding: '24px',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)',
    minHeight: '100vh',
    fontFamily: 'Inter, system-ui, sans-serif'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
    color: 'white',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 10px 30px rgba(15, 118, 110, 0.2)'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '20px',
    border: '1px solid rgba(15, 118, 110, 0.1)'
  };

  const controlsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  };

  const selectStyle = {
    padding: '10px 14px',
    border: '2px solid #0f766e',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#0f766e',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'rgba(15, 118, 110, 0.1)',
    color: '#0f766e',
    border: '2px solid #0f766e'
  };

  const alertCardStyle = (severity) => ({
    background: getSeverityBg(severity),
    border: `2px solid ${getSeverityColor(severity)}`,
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px'
  });

  const predictionLabelStyle = (severity) => ({
    display: 'inline-block',
    background: getSeverityColor(severity),
    color: 'white',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '700',
    marginRight: '8px',
    textTransform: 'uppercase'
  });

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  };

  const statBoxStyle = {
    background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)',
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid #0f766e',
    textAlign: 'center'
  };

  const statValueStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f766e',
    marginBottom: '4px'
  };

  const statLabelStyle = {
    fontSize: '12px',
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>🔮 Predictive Alerts</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>AI-powered water quality trend analysis and predictions</p>
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: '#0f766e', marginTop: 0 }}>Analysis Settings</h2>
        <div style={controlsStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#0f766e' }}>
              Select Station
            </label>
            <select
              value={selectedStation || ''}
              onChange={(e) => setSelectedStation(Number(e.target.value))}
              style={selectStyle}
            >
              <option value="">Choose a station...</option>
              {stations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#0f766e' }}>
              Look-back Period
            </label>
            <select
              value={lookbackDays}
              onChange={(e) => setLookbackDays(Number(e.target.value))}
              style={selectStyle}
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <button
              onClick={analyzePredictions}
              disabled={!selectedStation || loading}
              style={{ ...buttonStyle, opacity: !selectedStation || loading ? 0.6 : 1, flex: 1 }}
            >
              {loading ? 'Analyzing...' : 'Analyze Trends'}
            </button>
          </div>
        </div>

        {user?.role === 'authority' && (
          <div style={{ borderTop: '2px solid #0f766e', paddingTop: '16px', marginTop: '16px' }}>
            <h3 style={{ color: '#0f766e', marginTop: 0 }}>Authority Actions</h3>
            <button
              onClick={runAutoAnalysis}
              disabled={loading}
              style={{ ...secondaryButtonStyle, opacity: loading ? 0.6 : 1 }}
            >
              {autoAnalysis ? '✓ Analysis Completed' : '🤖 Run Auto-Prediction for All Stations'}
            </button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Analyzes all stations and automatically creates alerts for critical predictions.
            </p>
          </div>
        )}
      </div>

      {trends && (
        <div style={cardStyle}>
          <h2 style={{ color: '#0f766e', marginTop: 0 }}>📊 Water Quality Statistics</h2>
          <div style={statsGridStyle}>
            {Object.entries(trends.statistics).map(([param, stats]) => (
              <div key={param} style={statBoxStyle}>
                <div style={statValueStyle}>{stats.avg.toFixed(2)}</div>
                <div style={statLabelStyle}>{param.replace(/_/g, ' ')}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                  {stats.min.toFixed(2)} - {stats.max.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ color: '#0f766e', marginTop: 0 }}>⚠️ Predicted Alerts</h2>
        {loading && <p style={{ color: '#0f766e', fontWeight: '600' }}>Analyzing water quality data...</p>}

        {!loading && predictions.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            ✓ No concerning trends detected. Water quality appears normal.
          </p>
        )}

        {!loading && predictions.length > 0 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#dc2626' }}>Critical: {predictions.filter(p => p.severity === 'critical').length}</strong>
              <span style={{ marginLeft: '16px', color: '#666' }}>|</span>
              <span style={{ marginLeft: '16px' }}>
                <strong style={{ color: '#f97316' }}>High: {predictions.filter(p => p.severity === 'high').length}</strong>
              </span>
              <span style={{ marginLeft: '16px', color: '#666' }}>|</span>
              <span style={{ marginLeft: '16px' }}>
                <strong style={{ color: '#eab308' }}>Medium: {predictions.filter(p => p.severity === 'medium').length}</strong>
              </span>
            </div>

            {predictions.map((prediction, idx) => (
              <div key={idx} style={alertCardStyle(prediction.severity)}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '8px' }}>
                  <span style={predictionLabelStyle(prediction.severity)}>
                    {prediction.severity}
                  </span>
                  <strong style={{ color: '#0f766e', flex: 1 }}>
                    {prediction.parameter.replace(/_/g, ' ').toUpperCase()}
                  </strong>
                </div>
                <p style={{ margin: '8px 0', color: '#333', fontSize: '14px' }}>
                  {prediction.message}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#666' }}>
                  <span>Current: <strong>{prediction.recent_value.toFixed(3)}</strong></span>
                  <span>Trend: <strong>{prediction.trend}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {trends && (
        <div style={cardStyle}>
          <h2 style={{ color: '#0f766e', marginTop: 0 }}>📈 Trend Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ ...statBoxStyle, borderColor: '#dc2626' }}>
              <div style={{ ...statValueStyle, color: '#dc2626' }}>
                {trends.critical_alerts}
              </div>
              <div style={statLabelStyle}>Critical Alerts</div>
            </div>
            <div style={{ ...statBoxStyle, borderColor: '#f97316' }}>
              <div style={{ ...statValueStyle, color: '#f97316' }}>
                {trends.warning_alerts}
              </div>
              <div style={statLabelStyle}>Warning Alerts</div>
            </div>
            <div style={{ ...statBoxStyle, borderColor: '#10b981' }}>
              <div style={{ ...statValueStyle, color: '#10b981' }}>
                {trends.analysis_period_days}
              </div>
              <div style={statLabelStyle}>Days Analyzed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveAlerts;
