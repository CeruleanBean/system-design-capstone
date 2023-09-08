import React, {useState, useEffect} from 'react';




const DataObject = ({obj}) => {
  let dataArr = Object.entries(obj)

  return (
    <div>
      <p>ID {obj.question_id}</p>
      {dataArr.map((prop, index)=> {
        if (typeof prop[1] === 'object') {
          if(Array.isArray(prop[1])) {
            return <div key={index}>Photo url</div>
          } else if(prop[1] === null) {
            return <div key={index}>null</div>
          }else {
            return <div key={index}>answers</div>;
          }

        } else {
          return <li key={index}>{prop[0]}: {prop[1]}</li>
        }
      })}
    </div>
  );
}



export default DataObject;