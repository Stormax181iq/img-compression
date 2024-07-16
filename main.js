const fs = require("node:fs/promises");
const path = require("path");
const sharp = require("sharp");

const args = process.argv.slice(2);

const supportedImageFormats = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
];

function printWelcome() {
  console.log(`
    This app allows fast image compression to a 200x200 format.
    
    Type "node . help" to see usage.`);
}

function printHelp() {
  console.log(`
    Usage :
    node . <input_path>
      | Compresses all the images in the <input_path> folder in place.
    node . <input_path> <output_path>
      | Compresses all the images in the <input_path> folder, and puts them in the specified <output_path> if it exists.`);
}

function parseArguments(args) {
  const options = {};

  if (args.length === 0) {
    options.welcome = true;
  }

  if (args[0] === "help") {
    options.help = true;
  } else if (args[0]) {
    options.inputPath = args[0];
  }

  if (args[1]) {
    options.outputPath = args[1];
  }

  return options;
}

async function main() {
  const options = parseArguments(args);

  const inputPath = options.inputPath && path.normalize(options.inputPath);
  const outputPath = options.outputPath && path.normalize(options.outputPath);

  if (options.welcome) {
    printWelcome();
  }

  if (options.help) {
    printHelp();
  }

  if (options.inputPath && options.outputPath) {
    const inputFiles = await fs.readdir(inputPath);
    inputFiles.forEach((file) => {
      const ext = path.extname(file);
      if (supportedImageFormats.includes(ext.toLowerCase())) {
        compressImage(path.join(inputPath, file), outputPath);
      } else {
        console.error(`${path.basename(file)} is not a valid format`);
      }
    });
  } else if (options.inputPath) {
    const inputFiles = await fs.readdir(inputPath);
    inputFiles.forEach((file) => {
      const ext = path.extname(file);
      if (supportedImageFormats.includes(ext.toLowerCase())) {
        compressImage(path.join(inputPath, file));
      } else {
        console.error(`${path.basename(file)} is not a valid format`);
      }
    });
  }
}

function compressImage(filePath, outputPath = null) {
  const fileName = path.basename(filePath);
  sharp(filePath)
    .resize(200)
    .toFile(
      outputPath
        ? path.join(outputPath, `compressed_${fileName}`)
        : path.join(path.dirname(filePath), `compressed_${fileName}`)
    );
}

main();
