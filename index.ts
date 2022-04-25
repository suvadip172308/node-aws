import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';

import {
  uploadFile,
  downloadFile,
  deleteFile,
  deleteMultiple
} from "./s3";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  }
});

//route

app.post('/upload', multerConfig.single('file'), async (req,res) => {
  const file = req.file;
  const result = await uploadFile(file);

  console.log('Result :', result);

  res.status(200).json('Successful');
});

app.get('/download/:key', async (req, res) => {
  const key = req.params.key;
  const readStream = downloadFile(key);

  readStream.pipe(res);
});

app.delete('/delete/multiple', async (req,res) => {
  const keys = req.body.keys;
  const delRes = await deleteMultiple(keys);

  console.log('Deleted Files :', delRes);

  res.status(200).json('deleted all');
});

app.delete('/delete/:key', async (req, res) => {
  const key = req.params.key;
  const delFile = await deleteFile(key);

  console.log('Deleted :', delFile);

  res.status(200).json('deleted');
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Listining at port no: ${port} ...`));