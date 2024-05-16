import React from 'react';
import Moment from 'react-moment';
import Button from './Button';

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map(item => (
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>{item.author}</span>
        <span style={{ width: '20%' }}>
          hace <Moment fromNow ago locale="es">{item.created_at}</Moment>
        </span>
        <span style={{ width: '10%' }}>
          <Button className="button-inline" onClick={() => onDismiss(item.objectID)}>
            Dismiss
          </Button>
        </span>
      </div>
    ))}
  </div>
);

export default Table;
