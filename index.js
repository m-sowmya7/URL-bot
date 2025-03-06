import express, { json } from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const app = express();
import  {connectToMongoDb}  from './mongo.js';
import urlRoute from './routes/url.js';
import URL from './models/url.js';
const PORT = process.env.PORT || 8001;

connectToMongoDb(process.env.MONGO_DB_CONNECT)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use(json());
app.use('/url', urlRoute);
app.use(express.json());

app.get('/:shortId', async (req, res) => {
    try {
        // console.log("Converted timestamp:", new Date(1740746006542)); 

        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            { miniId: shortId }, // Find document by shortId
            { $push: { visitHistory: Date.now() }  }, // Log visit
            { new: true } // Return updated document
        );

        if (!entry) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        res.redirect(entry.redirectedId); //from controllers in newUrl
    } catch (error) {
        console.error("Error handling redirect:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => console.log(`Server running at ${PORT}`));

module.exports = app;