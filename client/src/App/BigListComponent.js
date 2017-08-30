import React from 'react';

const BigListComponent = ({ list }) => (
  <div>{list.map(i => <div key={i.id}>{i.nome}</div>)}</div>
);

export default BigListComponent;
