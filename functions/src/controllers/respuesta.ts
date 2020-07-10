import * as admin from 'firebase-admin';

import { Request, Response, Router } from 'express';

const collection = "respuestas";
const getDb = (): FirebaseFirestore.Firestore => {

  return admin.firestore();
}

const convertDate = (firebaseObject: any): any => {
  if (!firebaseObject) return null;

  for (const [key, value] of Object.entries(firebaseObject)) {

    // covert items inside array
    if (value && Array.isArray(value))
      firebaseObject[key] = value.map(item => convertDate(item));

    // convert inner objects
    if (value && typeof value === 'object') {
      firebaseObject[key] = convertDate(value);
    }

    // convert simple properties
    if (value && (value as any).hasOwnProperty('_seconds'))
      firebaseObject[key] = (value as FirebaseFirestore.Timestamp).toDate();
  }
  return firebaseObject;
}

const convertDoc = (doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData> | FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): any => {
  const convertDoc = convertDate(doc.data())
  return {
    id: doc.id,
    ...convertDoc
  }
}
const getRespuestas = async (request: Request, response: Response) => {
  const db = getDb();

  const snapshot = await db.collection(collection).get()

  response.send(snapshot.docs.map(doc => convertDoc(doc)))
}

const saveRespuesta = async (request: Request, response: Response) => {
  const { id, data } = request.body;

  const ref = getDb().doc(`${collection}/${id}`);

  const doc = (await ref.get()).data()

  // if it exist
  if (doc) {
    response.status(409).send({ data: `Respuesta already created with id:${id}` })
  }
  else {
    // If it doesn't create it
    const s = await ref.set({ data })

    response.send(s);
  }
}

const getOneRespuesta = async (request: Request, response: Response) => {
  const { id } = request.params;

  const path = `${collection}/${id}`
  const ref = getDb().doc(path)

  const doc = (await ref.get())

  if (doc) {
    response.send(convertDoc(doc))
  }
  else {
    response.status(404).send({ data: `The respuesta with id = ${id} does not exist` })
  }
}

const updateRespuesta = async (request: Request, response: Response) => {
  const { id, data } = request.body;

  const path = `${collection}/${id}`
  const ref = getDb().doc(path)

  const doc = (await ref.get()).data()

  if (doc) {
    const s = (await ref.set(data))
    response.send(s)
  }
  else {
    response.status(404).send({ data: `The respuesta with id = ${id} does not exist` })
  }
}

const respuestaRouter = Router()
respuestaRouter
  .get("/", getRespuestas)
  .post("/", saveRespuesta)
  .get("/:id", getOneRespuesta)
  .put("/", updateRespuesta)
export { respuestaRouter }
