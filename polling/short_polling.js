const express = require('express');
const jobs = {};

const app = express();

app.post('/submit', (req, res) => {
  const jobId = `${Date.now()}`;
  jobs[jobId] = 0;
  updateJobId(jobId, 0);
  res.status(200).send(`\n\n${jobId}\n\n`);
});

app.get('/checkStatus', (req, res) => {
  const jobId = req.query.jobId;
  console.log(jobs[jobId]);
  res.status(200).send(`\n\nJob Status: ${jobs[jobId]}\n\n`);
});

app.listen(8080, () => console.log('Server running on port 8080'));

function updateJobId(jobId, prg) {
  jobs[jobId] = prg;
  console.log(`Updated ${jobId} to ${prg}`);
  if (prg === 100) return;
  setTimeout(() => {
    updateJobId(jobId, prg + 10);
  }, 3000);
}
