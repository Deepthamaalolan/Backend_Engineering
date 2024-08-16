const express = require('express');
const jobs = {};

const app = express();

app.post('/submit', (req, res) => {
  const jobId = `${Date.now()}`;
  jobs[jobId] = 0;
  updateJobId(jobId, 0);
  res.status(200).send(`\n\n${jobId}\n\n`);
});

app.get('/checkStatus', async (req, res) => {
  const jobId = req.query.jobId;

  if (!jobId || !jobs.hasOwnProperty(jobId)) {
    return res.status(400).send("\n\nInvalid Job ID\n\n");
  }

  try {
    // Wait until the job is complete or a timeout occurs
    await waitForJobCompletion(jobId, res);
  } catch (error) {
    console.error('Error during long polling:', error);
    res.status(500).send("\n\nServer Error\n\n");
  }
});

app.listen(8080, () => console.log('Server running on port 8080'));

async function waitForJobCompletion(jobId, res) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (jobs[jobId] >= 100) {
        clearInterval(interval);
        res.status(200).send(`\n\nJob Status: ${jobs[jobId]}\n\n`);
        resolve();
      }
    }, 1000);

    // Timeout after 30 seconds to prevent hanging indefinitely
    setTimeout(() => {
      clearInterval(interval);
      reject(new Error('Polling timed out'));
    }, 30000);
  });
}

function updateJobId(jobId, prg) {
  jobs[jobId] = prg;
  console.log(`Updated ${jobId} to ${prg}`);
  if (prg === 100) return;
  setTimeout(() => {
    updateJobId(jobId, prg + 10);
  }, 3000);
}
