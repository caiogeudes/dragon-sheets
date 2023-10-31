const { parse } = require('node-html-parser');
const fs = require('fs').promises;

const getNewSheetPage = async (req, res) => {
    try {
        const htmlFile = await fs.readFile('./src/public/new-sheet.html', 'utf-8', (err, data) => {
            if (err) {
                return console.log(err.message);
            } else {
                return data
            }
        });
        const root = parse(htmlFile);
        const rootString = root.toString();
        return res.status(200).send(rootString);
    } catch (error) {

    }
}

module.exports = {
    getNewSheetPage
}