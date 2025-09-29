import { fetch } from "bun";

async function getData() {
  const response = await fetch("http://localhost:3001/api/v1/hello");
  console.log(response.headers);

  const data = await response.json();
  console.log(data);
}

getData();
