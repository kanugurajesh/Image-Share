import clientPromise from "../../lib/mongodb";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("rajesh");
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let myPost = await db.collection("rajesh").insertOne(bodyObject);
      break;
    case "GET":
      const allPosts = await db.collection("allPosts").find({}).toArray();
      res.json({ status: 200, data: allPosts });
      break;
    default:
      res.status(405).end("do properly"); // Method Not Allowed
      break;
  }
}