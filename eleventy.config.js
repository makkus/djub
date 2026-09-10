import QRCode from "qrcode";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });
  eleventyConfig.addNunjucksAsyncShortcode("qr", async (destination) => {
    const url = new URL(destination);
    if (!["https:", "http:"].includes(url.protocol)) {
      throw new Error("QR destinations must be absolute HTTP(S) URLs.");
    }
    const svg = await QRCode.toString(destination, {
      type: "svg", errorCorrectionLevel: "M", margin: 4,
      color: { dark: "#000000", light: "#ffffff" },
    });
    return svg.replace("<svg ", '<svg aria-hidden="true" focusable="false" ');
  });
  eleventyConfig.addFilter("eventDate", (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new Error(`Invalid event date: ${value}`);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    }).format(date);
  });
  eleventyConfig.addCollection("events", (api) =>
    api.getFilteredByTag("event").sort((a, b) =>
      a.data.title.localeCompare(b.data.title, "en"),
    ),
  );
  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    pathPrefix: process.env.PATH_PREFIX || "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
