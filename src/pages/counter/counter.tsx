import React, { useState } from "react";
import Layout from "@theme/Layout";

function Hello() {
  const [cnt, setCnt] = useState(0);

  const handle_Plus = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCnt((p) => p + 1);
  };
  const handle_Minus = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCnt((p) => p - 1);
  };
  return (
    <Layout title="Hello">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: "20px",
        }}
      >
        <p>
          Edit <code>pages/counter.tsx</code> and save to reload.
        </p>
        <div>{cnt}</div>
        <button onClick={handle_Plus}>+</button>
        <button onClick={handle_Minus}>-</button>
      </div>
    </Layout>
  );
}

export default Hello;
