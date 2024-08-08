export async function POST(req) {
  try {
    const { message } = await req.json();
    console.log("Received message:", message);

    const prompt = `
    You are a travel assistant. Answer the following questions about travel, destinations, and travel planning in a helpful and informative manner. Make responses short and concise. \n\nUser: ${message}`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();
    console.log("OpenRouter response:", data);

    const assistantMessage =
      data.choices && data.choices.length > 0
        ? data.choices[0].message.content
        : "Sorry, I didn't get that.";
    return new Response(JSON.stringify({ response: assistantMessage }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return new Response(
      JSON.stringify({ error: "Error communicating with OpenRouter" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
