export async function sendPdfToSummaryApi(fileValue) {
  const formData = new FormData();
  formData.append("file", fileValue);
    console.log("Sending file to summary API:", fileValue);
  try {
    const response = await fetch("http://127.0.0.1:8000/summary/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Summary response:", result);
    return result;
  } catch (error) {
    console.error("Error during summary fetch:", error);
    return { error: error.message };
  }
}