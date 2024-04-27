import draw from "../common/draw.mjs";
import fs from "fs";
import { createCanvas } from "canvas";


const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

/**
 * In this file, we are trying to process drawing data, extracting infos from json files.
 */

const constants = {};

constants.DATA_DIR =  "../data";
constants.RAW_DIR = constants.DATA_DIR + "/raw";
constants.DATASET_DIR = constants.DATA_DIR + "/dataset";
constants.JSON_DIR = constants.DATASET_DIR + "/json";
constants.IMG_DIR = constants.DATASET_DIR + "/img";
constants.SAMPLES = constants.DATASET_DIR + "/samples.json";

const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;
//get all raw data.
fileNames.forEach((fn) => {
  const content = fs.readFileSync(constants.RAW_DIR + "/" + fn);
  const { session, student, drawings } = JSON.parse(content);
  //for each label in drawings of a data file.
  for (const label in drawings) {
    samples.push({
      id,
      label,
      student_name: student,
      student_id: session,
    });
    const paths = drawings[label]; //get the drawings for label.

    generateImageFile(constants.IMG_DIR + "/" + id + ".png", paths);

    fs.writeFileSync(
      constants.JSON_DIR + "/" + id + ".json",
      JSON.stringify(drawings[label])
    );
    id++;
  }
});

fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));

//draw images for each drawing.
function generateImageFile(outFile, paths) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw.paths(ctx, paths);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outFile, buffer);
}
