import { mkdir, rm, readdir } from "fs/promises";
import { join, basename } from "path";
import { transform } from "@svgr/core";
import { optimize } from "svgo";
import jsx from "@svgr/plugin-jsx";
import fs from "fs/promises";

const REPO_URL = "https://github.com/teenyicons/teenyicons.git";
const TEMP_DIR = "./temp";
const OUTPUT_DIR = "./src";
const ICON_DIRS = ["outline", "solid"] as const;

type TemplateData = {
  imports: Array<{
    specifiers: Array<{ local: { name: string } }>;
    source: { value: string };
  }>;
  interfaces: Array<{
    id: { name: string };
    body: {
      body: Array<{
        key: { name: string };
        typeAnnotation: { typeAnnotation: { type: string } };
      }>;
    };
  }>;
  componentName: string;
  props: Array<{ name: string; type: string }>;
  jsx: string;
};

async function ensureCleanDirectories() {
  // Clean and recreate temp and output directories
  await Promise.all([
    rm(TEMP_DIR, { recursive: true, force: true }),
    rm(OUTPUT_DIR, { recursive: true, force: true }),
  ]);
  await Promise.all([
    mkdir(TEMP_DIR, { recursive: true }),
    mkdir(OUTPUT_DIR, { recursive: true }),
    mkdir(join(OUTPUT_DIR, "components"), { recursive: true }),
  ]);
}

async function cloneRepo() {
  console.log("Cloning Teenyicons repository...");
  const process = Bun.spawn(["git", "clone", "--depth=1", REPO_URL, TEMP_DIR]);
  await process.exited;
}

const getComponentName = (svgPath: string): string => {
  let baseName = basename(svgPath, ".svg");
  // If the name starts with a number, prefix it with 'Icon'
  if (/^\d/.test(baseName)) {
    baseName = `Icon${baseName}`;
  }
  baseName = baseName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  const variant = ICON_DIRS.find((dir) => svgPath.includes(dir)) || "";
  return `${baseName}${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
};

const processSvgFile = async (svgPath: string, outputPath: string) => {
  const svgCode = await fs.readFile(svgPath, "utf8");
  const componentName = getComponentName(svgPath);
  const jsCode = await transform(
    svgCode,
    {
      plugins: [
        "@svgr/plugin-svgo",
        "@svgr/plugin-jsx",
        "@svgr/plugin-prettier",
      ],
      typescript: true,
      ref: false,
      memo: true,
      dimensions: true,
      icon: true,
      prettier: true,
      template: (variables, { tpl }) => {
        return tpl`
import type { SVGProps } from "react";
import { memo } from "react";

const ${variables.componentName} = (props: SVGProps<SVGSVGElement>) => ${variables.jsx};

const Memo = memo(${variables.componentName});
export default Memo;
`;
      },
    },
    { componentName }
  );
  await fs.writeFile(outputPath, jsCode);
};

async function generateComponents() {
  console.log("Generating React components...");

  const exports: string[] = [];

  for (const variant of ICON_DIRS) {
    const variantDir = join(TEMP_DIR, "src", variant);
    const files = await readdir(variantDir);

    for (const file of files) {
      if (!file.endsWith(".svg")) continue;

      const baseName = file.replace(".svg", "");
      let componentName = baseName
        .split("-")
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

      // Prefix with 'Icon' if the component name starts with a number
      if (/^\d/.test(componentName)) {
        componentName = "Icon" + componentName;
      }

      const fullComponentName = `${componentName}${
        variant.charAt(0).toUpperCase() + variant.slice(1)
      }`;
      const outputPath = join(
        OUTPUT_DIR,
        "components",
        `${fullComponentName}.tsx`
      );

      const componentCode = await processSvgFile(
        join(variantDir, file),
        outputPath
      );

      exports.push(
        `export { default as ${fullComponentName} } from './components/${fullComponentName}';`
      );
    }
  }

  // Generate index file
  const indexContent = exports.join("\n") + "\n";
  await Bun.write(join(OUTPUT_DIR, "index.ts"), indexContent);
}

async function main() {
  console.log("Starting icon generation...");

  try {
    await ensureCleanDirectories();
    await cloneRepo();
    await generateComponents();

    // Cleanup temp directory
    await rm(TEMP_DIR, { recursive: true, force: true });

    console.log("Successfully generated React components!");
  } catch (error) {
    console.error("Error generating components:", error);
    process.exit(1);
  }
}

main();
