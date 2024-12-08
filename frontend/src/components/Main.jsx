import React, { useState, useEffect } from "react";
import {
  TextAreaField,
  FileUploadField,
  SelectField,
  CheckboxGroup,
  RadioGroup,
  ApiKey,
} from "./UI/Input";

const MainContent = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch results
  const fetchResults = async () => {
    try {
      const response = await fetch("http://localhost:8000/results");
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setError("Failed to fetch results");
      }
    } catch (error) {
      setError("Error fetching results: " + error.message);
    }
  };

  // Load results on component mount
  useEffect(() => {
    fetchResults();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.target);

    try {
      const response = await fetch("http://localhost:8000/settings", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Form submitted successfully!");
        // Refresh results after submission
        fetchResults();
      } else {
        const errorText = await response.text();
        setError("Form submission failed: " + errorText);
      }
    } catch (error) {
      setError("Error submitting form: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">
          Test Automation
          <br />
          <small className="text-gray-600">
            Revolutionize your testing with Gherkin-powered automation
          </small>
        </h1>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="mb-8">
          {/* Your existing form fields */}
          <TextAreaField
            label="Gherkin Text"
            id="data01"
            name="gherkin_data"
            placeholder="Your Gherkin text"
            rows={6}
            cols={50}
            className="input-data"
          />
          <FileUploadField
            label="Upload test data"
            id="data02"
            name="filename"
            className="input-data"
          />
          <SelectField
            label="Choose a model"
            id="data03"
            name="llm_model"
            options={[
              { value: "gpt4o", label: "GPT-4o" },
              { value: "gpt4omini", label: "GPT-4o mini" },
            ]}
            className="input-data"
          />

          <ApiKey
            label="API Key"
            id="data04"
            name="apikey"
            className="input-data"
            placeholder={"sk-proj-Acklfseof5...."}
          />
          <CheckboxGroup
            legend="Execution Parameters"
            options={[
              {
                name: "params",
                value: "headless",
                label: "Enable Headless Mode",
              },
              { name: "params", value: "record-video", label: "Record Video" },
              {
                name: "params",
                value: "take-screenshots",
                label: "Take Screenshots",
              },
              {
                name: "params",
                value: "capture-network-logs",
                label: "Capture Network Logs",
              },
            ]}
            className="input-checkbox"
          />
          <RadioGroup
            legend="Browser Type"
            name="browser"
            options={[
              { value: "chromium", label: "Chromium", defaultChecked: true },
              { value: "firefox", label: "FireFox" },
              { value: "safari", label: "Safari" },
            ]}
            className="input-radio"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Executing..." : "Execute"}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Results Display */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Timestamp</th>
                  <th className="px-4 py-2">Model</th>
                  <th className="px-4 py-2">Browser</th>
                  <th className="px-4 py-2">Headless</th>
                  <th className="px-4 py-2">Parameters</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="border-t border-gray-300">
                    <td className="px-4 py-2">{result.id}</td>
                    <td className="px-4 py-2">{result.timestamp}</td>
                    <td className="px-4 py-2">{result.model}</td>
                    <td className="px-4 py-2">{result.browser}</td>
                    <td className="px-4 py-2">
                      {result.headless ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2">{result.params.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
