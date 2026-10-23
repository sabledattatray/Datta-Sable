// Self-host the Latin variable fonts and their licenses from Google Fonts.
// Run only when intentionally refreshing the bundled font assets.
const fs = require('node:fs/promises');
const path = require('node:path');
const families = ['Roboto', 'Open Sans', 'Montserrat', 'Nunito', 'Lora', 'Playfair Display', 'Raleway', 'Poppins', 'Kanit'];

async function download(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${response.status} fetching ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

(async () => {
  const directory = path.resolve(__dirname, '../public/fonts/typography');
  await fs.mkdir(directory, { recursive: true });
  for (const family of families) {
    const slug = family.toLowerCase().replaceAll(' ', '-');
    const range = ['Poppins', 'Kanit'].includes(family)
      ? '300;400;500;600;700;800'
      : family === 'Lora' ? '400..700' : family === 'Playfair Display' ? '400..800' : '300..800';
    const css = (await download(`https://fonts.googleapis.com/css2?family=${family.replaceAll(' ', '+')}:wght@${range}&display=swap`)).toString();
    const latin = css.match(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/);
    const url = latin?.[1].match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/)?.[1];
    if (!url) throw new Error(`No Latin WOFF2 found for ${family}`);
    const font = await download(url);
    if (font.subarray(0, 4).toString() !== 'wOF2') throw new Error(`Invalid WOFF2 for ${family}`);
    const license = await download(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family.toLowerCase().replaceAll(' ', '')}/OFL.txt`);
    await fs.writeFile(path.join(directory, `${slug}-latin-variable.woff2`), font);
    await fs.writeFile(path.join(directory, `${slug}-OFL.txt`), license);
    console.log(`${family}: ${font.length} bytes`);
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
