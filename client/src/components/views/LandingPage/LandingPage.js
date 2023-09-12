import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // axios.get('http://localhost:5000/api/hello')
    axios
      .get("/api/hello")
      .then((res) => console.log(res.data))
      .catch((err) => console.log("힝 에러"));
  }, []);

  const onClickHandler = () => {
    axios.get('/api/logout')
      .then((response) => {
        if (response.data.success) {
          navigate("/login");
        } else {
          alert("로그아웃 하는데 실패 했습니다.");
        }
      })
      .catch(err => console.log(err))
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작 페이지</h2>
      <button onClick={onClickHandler}>로그아웃</button>{" "}
    </div>
  );
}

export default LandingPage;
