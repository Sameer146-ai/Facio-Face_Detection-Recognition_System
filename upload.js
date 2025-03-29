//  apikey = AIzaSyB23Gq-sbrq6uoBEoRsyyuiNMHN47fFzc8
const GEMINI_API_KEY = "AIzaSyB23Gq-sbrq6uoBEoRsyyuiNMHN47fFzc8";

// Function to process image uploads for different tasks
async function submitImage(inputId, taskType) {
  console.log(`📤 Function 'submitImage()' is called for ${taskType}`);

  const fileInput = document.getElementById(inputId);
  if (!fileInput || !fileInput.files.length) {
    console.error("❌ No image selected!");
    document.getElementById("responseText").innerText =
      "⚠️ Please upload an image.";
    return;
  }

  const imageFile = fileInput.files[0];
  console.log(
    "📤 Selected File:",
    imageFile.name,
    imageFile.type,
    imageFile.size
  );

  const reader = new FileReader();

  reader.onload = async function () {
    console.log("🖼 FileReader finished reading.");

    const base64Image = reader.result.split(",")[1];
    if (!base64Image) {
      console.error("❌ Base64 encoding failed!");
      document.getElementById("responseText").innerText =
        "⚠️ Image encoding error.";
      return;
    }

    console.log("📡 Encoded Image:", base64Image.substring(0, 100) + "...");

    let promptText = "";
    switch (taskType) {
      case "face":
        promptText =
          "Detect faces in this image and give the count of faces and give the age of each person in the image ";
        break;
      case "description":
        promptText =
          "Describe this image in detail. describe about what is happening in this image and give the detail about the image in 200 words";
        break;
      case "expression":
        promptText =
          "Analyze the facial expressions in this image. and give in point like in point (numbers,alphabets) wise to user and give the facial expression in percentage also in point wise and give a graph image also ";
        break;
      case "celebrity":
        promptText =
          "Identify any celebrities in this image and give detail about its life in 300 words his DOB And about its profession ";
        break;
      default:
        console.error("❌ Unknown task type!");
        return;
    }

    const requestData = {
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            { inlineData: { data: base64Image, mimeType: imageFile.type } },
          ],
        },
      ],
    };

    console.log(`🚀 Sending request to Gemini API for ${taskType}...`);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      console.log("📡 Fetch request completed.");
      const responseData = await response.json();
      console.log(
        "📡 Full API Response:",
        JSON.stringify(responseData, null, 2)
      );

      const resultText =
        responseData.candidates?.[0]?.content?.parts
          ?.map((part) => part.text)
          .join(" ") || "⚠️ No relevant data found.";
      document.getElementById("responseText").innerText = resultText;
    } catch (error) {
      console.error("❌ API Call Error:", error);
      document.getElementById(
        "responseText"
      ).innerText = `Error: ${error.message}`;
    }
  };

  reader.onerror = function (error) {
    console.error("❌ FileReader Error:", error);
  };

  console.log("📖 Reading file as Data URL...");
  reader.readAsDataURL(imageFile);
}

// Attach event listeners to submit buttons
document
  .querySelector(".submit-btn[onclick*='faceUpload']")
  .addEventListener("click", () => submitImage("faceUpload", "face"));
document
  .querySelector(".submit-btn[onclick*='descUpload']")
  .addEventListener("click", () => submitImage("descUpload", "description"));
document
  .querySelector(".submit-btn[onclick*='expressionUpload']")
  .addEventListener("click", () =>
    submitImage("expressionUpload", "expression")
  );
document
  .querySelector(".submit-btn[onclick*='celebrityUpload']")
  .addEventListener("click", () => submitImage("celebrityUpload", "celebrity"));

// Ensure script loads correctly
console.log("✅ JavaScript is loaded and running!");



async function handleFaceComparison() {
  console.log("🔍 Comparing two faces...");

  const fileInput1 = document.getElementById("faceCompare1");
  const fileInput2 = document.getElementById("faceCompare2");

  if (!fileInput1.files.length || !fileInput2.files.length) {
    alert("⚠️ Please upload both images before comparing.");
    return;
  }

  const image1 = await convertToBase64(fileInput1.files[0]);
  const image2 = await convertToBase64(fileInput2.files[0]);

  const requestData = {
    contents: [
      {
        role: "user",
        parts: [
          { text: "Compare the similarity between these two faces and provide a similarity score." },
          { inlineData: { data: image1, mimeType: fileInput1.files[0].type } },
          { inlineData: { data: image2, mimeType: fileInput2.files[0].type } },
        ],
      },
    ],
  };

  try {
    document.getElementById("responseText").innerText = "🔄 Processing...";
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      }
    );

    const responseData = await response.json();
    console.log("📡 API Response:", responseData);

    const resultText =
      responseData.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .join(" ") || "⚠️ No relevant data found.";

    document.getElementById("responseText").innerText = `🔍 Similarity Score: ${resultText}`;
  } catch (error) {
    console.error("❌ API Error:", error);
    document.getElementById("responseText").innerText = "⚠️ Error comparing faces.";
  }
}

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
