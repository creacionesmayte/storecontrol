import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

import "./LineChart.scss";

// prettier-ignore
function LineChart({ chartData, chartRef, options, sortingval, select_year, select_month, years, months }) {

    return (
        <div className='line_chart'>
            {/* <div><Dropdown name='Sales Activity' dropvalues={['Dayly', 'Monthly', 'Yearly']} value_select={sorting} onChange={sortingval}/></div> */}
            <div className='d-flex justify-content-between mb-4 align-items-center'>
                <div>
                    <span className='title'>Sales Activity</span>
                </div>
                <div className='select_btn'>
                    <select value={select_year} name='year' onChange={sortingval}>
                        <option value='All'>All</option>
                        {
                            years?.map((item, index) =>
                                <option value={item} key={index}>{item}</option>
                            ) 
                        }
                    </select>
                    <select value={select_month} name='month' onChange={sortingval}>
                        <option value='All'>All</option>
                        {
                            months?.map((item, index) =>
                                <option value={item} key={index}>{item}</option>
                            ) 
                        }
                    </select>
                </div>
            </div>
            <Line data={chartData} options={options} ref={chartRef} />
        </div>
    )
}

export default LineChart;
