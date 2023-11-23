const express = require('express');
const path = require('path');
const multer = require('multer');
const { runCustomVisionScript } = require('./public/customVisionScript');

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('image'), async (req, res) => {
	try {
		// Access the uploaded image in req.file.buffer
		const imageBuffer = req.file.buffer;

		// Call the customVisionScript.js function
		const { predictions } = await runCustomVisionScript(imageBuffer);

		// Send the results back to the front end
		res.json(predictions);
	} catch (error) {
		console.error('Error returning API data:', error);

		if (error.response && error.response.body) {
			console.error('Error returning API data:', error.response.body);
		}

		throw new Error('Error making API request');
	}
	console.error('Error in /upload route:', error);
	res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});