import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import express from 'express';
import cors from 'cors';
import { respuestaRouter } from './controllers/respuesta';

admin.initializeApp();

const app = express();

app.use(cors({ origin: true }))

app.use("/respuesta", respuestaRouter);

exports.app = functions.https.onRequest(app)
