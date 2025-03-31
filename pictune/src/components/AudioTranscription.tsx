import { useState } from "react";

export default function AudioAnalyzer() {
  const [audioFile, setAudioFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");

  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const analyzeAudio = async () => {
    if (!audioFile) {
      alert("Please upload an audio file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      const response = await fetch("http://localhost:5000/analyze-audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setAnalysisResult(data.prompt);
    } catch (error) {
      console.error("Error analyzing audio:", error);
      alert("Error analyzing the audio file. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Audio Analysis & Art Prompt</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} className="mb-4" />
      <button onClick={analyzeAudio} className="bg-blue-500 text-white px-4 py-2 rounded">
        Analyze Audio
      </button>
      {analysisResult && (
        <div className="mt-4 p-2 bg-white rounded shadow">
          <h3 className="font-semibold">Generated Art Prompt:</h3>
          <p>{analysisResult}</p>
        </div>
      )}
    </div>
  );
}
