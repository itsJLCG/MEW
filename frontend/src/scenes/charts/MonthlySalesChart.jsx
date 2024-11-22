import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TextField, Button, Box } from '@mui/material';
import moment from 'moment';

const MonthlySalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Date range states
  const [startDate, setStartDate] = useState(moment().subtract(12, 'months').startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'));

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Send a request with query parameters
      const response = await axios.get(`http://localhost:4000/api/sales/monthly`, {
        params: { startDate, endDate }, // Pass the selected date range
      });

      if (response.data.success) {
        setSalesData(response.data.salesData);
      } else {
        setError(response.data.message || 'Failed to fetch sales data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [startDate, endDate]); // Re-fetch data when date range changes

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '200px' }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '200px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchSalesData}
          sx={{ padding: '10px 20px' }}
        >
          Apply
        </Button>
      </Box>

      <Box sx={{ width: '100%', height: '500px' }}>
        {loading ? (
          <p>Loading sales data...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Error: {error}</p>
        ) : (
          <ResponsiveContainer>
            <LineChart
              data={salesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }} // Increased bottom margin
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(month) => moment(month, 'YYYY-MM').format('MMM')}
                label={{ value: 'Months', position: 'insideBottom', offset: -30 }}
              />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} /> {/* Position legend at the top */}
              <Line type="monotone" dataKey="totalSales" stroke="#8884d8" name="Total Sales" />
              <Line type="monotone" dataKey="orderCount" stroke="#82ca9d" name="Order Count" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default MonthlySalesChart;
