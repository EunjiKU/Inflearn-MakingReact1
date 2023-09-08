import React, { useEffect } from "react";
import axios from 'axios';

function LandingPage() {
  useEffect(() => {
    // axios.get('http://localhost:5000/api/hello')
    axios.get('/api/hello')
      .then(res => console.log(res.data))
      .catch(err => console.log("힝 에러"))
  }, [])

  return (
    <div>
      LandingPage
    </div>
  )
}

export default LandingPage;