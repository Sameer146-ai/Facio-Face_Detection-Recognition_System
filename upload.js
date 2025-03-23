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
          "Analyze the facial expressions in this image. and give in point wise to user and give the facial expression in percentage also in point wise and give a graph image also ";
        break;
      case "celebrity":
        promptText =
          "Identify any celebrities in this image and give detail about its life in 200 words his DOB And about its profession ";
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
