import React, { useEffect, useRef } from 'react';
import ReactEcharts from 'echarts-for-react'
import Draggable, { Direction } from '../';
import './DraggableTest.css';

function DraggableTest(props: any) {
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
  let axisValue = Direction.both;
  
  const { axis, grid, bounds } = props;
  if (axis && axis === 'x') {
    axisValue = Direction.x;
  } else if (axis && axis === 'y') {
    axisValue = Direction.y;
  } else if (axis && axis === 'none') {
    axisValue = Direction.none;
  }

  // console.log('axisValue :>> ', Direction[axisValue]);
  return (
    <div>
      <Draggable axis={axisValue} grid={grid} bounds={bounds}>
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
