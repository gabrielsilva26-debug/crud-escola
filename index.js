const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// importar routers (após os arquivos serem criados)
const alunosRouter = require('./routes/alunos');       // Membro 1
const professoresRouter = require('./routes/professores'); // Membro 2

app.use('/alunos', alunosRouter);
app.use('/professores', professoresRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
