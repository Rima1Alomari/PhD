// const API_BASE_URL = "https://www.virustotal.com/api/v3";
// let API_KEY = "eccb8d3540787e4156cc679bacbdb3c5170671baf27524f596ced271cba3ba9f";

// // Fetch Analysis ID
// export async function fetchAnalysisId(url) {
//   const options = {
//     method: "POST",
//     headers: {
//       accept: "application/json",
//       "x-apikey": API_KEY,
//       "content-type": "application/x-www-form-urlencoded",
//     },
//     // Send the URL in the body as URL-encoded data instead of as query parameters
//     body: new URLSearchParams({ url }),
//   };
//   const response = await fetch(`${API_BASE_URL}/urls`, options);
//   if (!response.ok) {
//     const data = await response.json();
//     throw new Error("Error fetching URL analysis: " + data.message);
//   }
//   return (await response.json()).data.id;
// }

// // Fetch Analysis Result
// export async function fetchAnalysisResult(analysisId) {
//   const options = {
//     method: "GET",
//     headers: {
//       accept: "application/json",
//       "x-apikey": API_KEY,
//     },
//   };
//   const response = await fetch(`${API_BASE_URL}/analyses/${analysisId}`, options);
//   if (!response.ok) {
//     const data = await response.json();
//     throw new Error("Error fetching analysis results: " + data.message);
//   }
//   return await response.json();
// }
const API_BASE_URL = "https://web-production-2d44.up.railway.app/api/predict";

export async function fetchPrediction(url) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  };

const response = await fetch(API_BASE_URL, options);


  if (!response.ok) {
    const data = await response.json();
    throw new Error("❌ Error from your model: " + data.message);
  }

  return await response.json(); 
}





// Email Spam Check
export async function checkEmailSpam(emailContent) {
  const API_KEY = 'sqdrKYLp4SKWMtYSEHecfPyObSVHs4f9';
  var myHeaders = new Headers();
  myHeaders.append("apikey", API_KEY);
  var raw = emailContent;

  var requestOptions = {
    method: 'POST',
    redirect: 'follow',
    headers: myHeaders,
    body: raw
  };
  
  const response = await fetch("https://api.apilayer.com/spamchecker?threshold=5", requestOptions)

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('خطأ في المصادقة - تأكد من صحة مفتاح API');
    }
    if (response.status === 429) {
      throw new Error('تم تجاوز حد الاستخدام اليومي/الشهري للـ API');
    }
    const data = await response.json();
    throw new Error('خطأ في فحص البريد الإلكتروني: ' + data.message);
  }
  const data = await response.json();
  return {
    success: true,
    score: data.score || 0,
    isSpam: data.is_spam || false,
    rules: [
      {
        description: data.result || 'تم تحليل المحتوى'
      }
    ]
  };
}
