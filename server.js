const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Tempat menyimpan data script sementara di memori server
let scripts = [];

// Endpoint untuk menyimpan script dari web
app.post('/api/scripts', (req, res) => {
    const { username, repo, visibility, code } = req.body;
    if (!username || !repo || !code) {
        return res.status(400).json({ error: "Data tidak lengkap" });
    }
    const cleanRepo = repo.replace(/\s+/g, '-');
    const hash = Math.random().toString(36).substring(2, 8);
    
    const newScript = { username, repo: cleanRepo, hash, visibility, code };
    scripts.unshift(newScript);
    
    res.json({ success: true, script: newScript });
});

// Endpoint RAW khusus Executor Roblox (Penting!)
app.get('/raw/:username/:repo/:hash/refs/heads/main/main.lua', (req, res) => {
    const { username, repo, hash } = req.params;
    const script = scripts.find(s => s.username === username && s.repo === repo && s.hash === hash);

    res.setHeader('Content-Type', 'text/plain');

    if (!script) {
        return res.status(404).send("-- 404: Script tidak ditemukan di FOXRAKA HUB");
    }

    if (script.visibility === 'private') {
        return res.send("Link ini diprivat karena owner tidak mengizinkan siapa pun melihat isi nya");
    }

    res.send(script.code);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server aktif di port ${PORT}`));
