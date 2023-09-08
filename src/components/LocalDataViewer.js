import React, {useState, useEffect} from 'react';
import axios from 'axios';
import DataObject from './DataObj.js';

const LocalDataViewer = () => {
  const [data, setData] = useState(['dummy']);

  useEffect(() => {
    fetchData();
  },[])


  const fetchData = () => {
    axios.get(`http://localhost:3000/qa/questions/131244/answers`)
      .then((res)=> {
        // console.log('successy boiiii', res.data);
        setData(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }
  const dataArr = data.results;
  if (data.results === undefined) {
    return (
      <>Loading...</>
    );
  } else {
    return (
      <div>
        <p>data stuffs</p>
        {dataArr.map((data, index) => {
          return <DataObject key={index} obj={data}/>
        })}
      </div>
    );
  }

}

export default LocalDataViewer;