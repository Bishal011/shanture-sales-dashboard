import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactECharts from 'echarts-for-react';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const AnalyticsDashboard = () => {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [regionSales, setRegionSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        };

        const [
          revenueResponse,
          topProductsResponse,
          regionSalesResponse,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/revenue-by-date`, { params }),
          axios.get(`${API_BASE_URL}/top-selling-products`, { params }),
          axios.get(`${API_BASE_URL}/region-sales`, { params }),
        ]);

        setRevenueData(revenueResponse.data);
        setTopProducts(topProductsResponse.data);
        setRegionSales(regionSalesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const revenueChartOptions = {
    title: { text: 'Total Revenue by Date', textStyle: { color: '#e0e0e0' } },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: revenueData.map(d => d.date),
      axisLabel: { color: '#b0b0b0' },
      axisLine: { lineStyle: { color: '#333' } },
    },
    yAxis: {
      type: 'value',
      name: 'Total Revenue',
      nameTextStyle: { color: '#b0b0b0' },
      axisLabel: { color: '#b0b0b0' },
      axisLine: { lineStyle: { color: '#333' } },
      splitLine: { lineStyle: { color: '#333' } },
    },
    series: [{
      name: 'Revenue',
      type: 'line',
      data: revenueData.map(d => parseFloat(d.totalRevenue)),
      itemStyle: { color: '#00bcd4' },
      lineStyle: { width: 3 },
    }],
  };

  const topProductsChartOptions = {
    title: { text: 'Top 5 Selling Products', textStyle: { color: '#e0e0e0' } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: topProducts.map(d => d.productName),
      axisLabel: { color: '#b0b0b0' },
      axisLine: { lineStyle: { color: '#333' } },
    },
    yAxis: {
      type: 'value',
      name: 'Total Sales',
      nameTextStyle: { color: '#b0b0b0' },
      axisLabel: { color: '#b0b0b0' },
      axisLine: { lineStyle: { color: '#333' } },
      splitLine: { lineStyle: { color: '#333' } },
    },
    series: [{
      name: 'Sales',
      type: 'bar',
      data: topProducts.map(d => parseFloat(d.totalSales)),
      itemStyle: { color: '#7e57c2' },
    }],
  };

  const regionSalesChartOptions = {
    title: { text: 'Sales by Region', textStyle: { color: '#e0e0e0' } },
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: regionSales.map(d => d.region),
      textStyle: { color: '#b0b0b0' },
    },
    series: [{
      name: 'Total Revenue',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: regionSales.map(d => ({ value: parseFloat(d.totalRevenue), name: d.region })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    }],
  };

  return (
    <div className="App">
      <h1>Sales Analytics Dashboard</h1>
      <div className="date-picker-container">
        <p className="date-picker-label">Select Date Range:</p>
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
      </div>
      {loading ? (
        <p className="loading-text">Loading data...</p>
      ) : (
        <div className="chart-container">
          <div className="chart-card">
            <ReactECharts option={revenueChartOptions} style={{ height: '450px' }} />
          </div>
          <div className="chart-card">
            <ReactECharts option={topProductsChartOptions} style={{ height: '450px' }} />
          </div>
          <div className="chart-card">
            <ReactECharts option={regionSalesChartOptions} style={{ height: '450px' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;