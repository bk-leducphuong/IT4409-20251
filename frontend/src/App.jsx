import { useState } from 'react';

import Login from './sites/Login/Login';
import WistList from './sites/WistList/WistList';
import Dev from './sites/Dev';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Dev />
    </>
  );
}

export default App;
