import fs from 'fs';
import path from 'path';

const modelFilePath = path.join(process.cwd(), 'public/model.json');
const modelData = fs.readFileSync(modelFilePath, 'utf-8');
const model = JSON.parse(modelData);

export default function handler(req, res) {
  res.status(200).json(model);
}
