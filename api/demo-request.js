module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const payload = {
      timestamp: new Date().toISOString(),
      name: String(body.name || "").trim(),
      role: String(body.role || "").trim(),
      fudNumber: String(body.fudNumber || "").trim(),
      addressLine1: String(body.addressLine1 || "").trim(),
      addressLine2: String(body.addressLine2 || "").trim(),
      phone: String(body.phone || "").trim(),
      volume: String(body.volume || "").trim(),
      source: "MandiOS Demo Form",
    };

    if (!payload.name || !payload.role || !payload.phone) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const webhookUrl = process.env.DEMO_WEBHOOK_URL || "";
    if (webhookUrl) {
      const forward = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!forward.ok) {
        const details = await forward.text();
        return res.status(502).json({
          ok: false,
          error: "Lead forward failed",
          details: details.slice(0, 300),
        });
      }
    } else {
      // Fallback for early testing when webhook is not set on Vercel.
      console.log("Demo request received (no DEMO_WEBHOOK_URL set):", payload);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Unexpected server error",
      details: String(error && error.message ? error.message : error).slice(0, 300),
    });
  }
};
