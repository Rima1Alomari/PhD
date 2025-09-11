const API_BASE_URL = "http://127.0.0.1:5000/api/predict";

export async function fetchPrediction(url) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  };
  const response = await fetch(API_BASE_URL, options);
  if (!response.ok) throw new Error("خطأ في النموذج");
  return await response.json();
}
