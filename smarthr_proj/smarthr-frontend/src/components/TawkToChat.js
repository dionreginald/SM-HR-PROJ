import { useEffect } from "react";

export default function TawkToChat() {
  useEffect(() => {
    // Check if already added
    if (document.getElementById("tawkToScript")) return;

    const s1 = document.createElement("script");
    s1.id = "tawkToScript";
    s1.async = true;
    s1.src = "https://embed.tawk.to/6868f9f7ce69b4190f3cf1c4/1ivd10rtc";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    document.body.appendChild(s1);
  }, []);

  return null; // No UI needed
}
