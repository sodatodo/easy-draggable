import React, { useEffect, useRef } from 'react';
import ReactEcharts from 'echarts-for-react'
import Draggable from '../';
import './DraggableTest.css';

function DraggableTest() {
  const ref = useRef(null);
  useEffect(() => {
    // console.log('ref.current :>> ', ref.current);
  }, []);
  const option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line'
    }]
  };
  return (
    <div>
      <Draggable ref={ref} >
        <div className="box">
          <ReactEcharts option={option} />
        </div>
      </Draggable>
      {/* <Draggable ref={ref} >
        <div className="box">
          <ReactEcharts option={option} />
        </div>
      </Draggable> */}
    </div>
  )
}

export default DraggableTest;
