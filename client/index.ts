import { fetch } from "bun";

async function getData() {
  const response = await fetch("http://localhost:3001/products/1");
  console.log(response.headers);

  const data = await response.json();
  console.log(JSON.stringify(data));
}

getData();
